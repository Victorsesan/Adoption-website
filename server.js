require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'adopt_admin_dd6706873f47289d261e18d4a03b1a07d7ba8603';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Ensure required directories exist
const DIRS = [
  'adoptions/pets/dogs',
  'adoptions/pets/cats',
  'adoptions/pets/birds',
  'adoptions/pets/reptiles',
  'adoptions/pets/small-mammals',
  'adoptions/applications',
];
DIRS.forEach(d => fs.mkdirSync(d, { recursive: true }));

// Initialize category index files if missing
const CATEGORIES = ['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'];
CATEGORIES.forEach(cat => {
  const indexPath = `adoptions/pets/${cat}/index.json`;
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, JSON.stringify({ category: cat, count: 0, pets: [], updated_at: new Date().toISOString() }, null, 2));
  }
});

// ─── Multer config for pet images ───────────────────────────────────────────
const petStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { category, pet_id } = req.petInfo || {};
    const dir = file.fieldname === 'single_image'
      ? `adoptions/pets/${category}/${pet_id}`
      : `adoptions/pets/${category}/${pet_id}/bulk_images`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'single_image') {
      cb(null, 'single_image' + path.extname(file.originalname).toLowerCase());
    } else {
      cb(null, Date.now() + '_' + Math.random().toString(36).substr(2, 6) + path.extname(file.originalname).toLowerCase());
    }
  }
});

const validateImageType = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const petUpload = multer({ storage: petStorage, fileFilter: validateImageType, limits: { fileSize: 10 * 1024 * 1024 } });

// ─── Multer config for application uploads ──────────────────────────────────
const appStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const code = req.adoptionCode || 'temp';
    const dir = `adoptions/applications/${code}/uploads`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '_' + Date.now() + ext);
  }
});

const allowedAppTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
const appUpload = multer({
  storage: appStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedAppTypes.includes(ext)) cb(null, true);
    else cb(new Error('Only images and PDFs are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

function generatePetId(category, existingIds) {
  const prefix = {
    dogs: 'DOG', cats: 'CAT', birds: 'BIRD', reptiles: 'REP', 'small-mammals': 'SM'
  }[category] || 'PET';
  let num = 1;
  while (existingIds.includes(`${prefix}-${String(num).padStart(5, '0')}`)) num++;
  return `${prefix}-${String(num).padStart(5, '0')}`;
}

function generateAdoptionCode() {
  let code;
  do {
    const p1 = Math.floor(10000 + Math.random() * 90000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    code = `AD-${p1}-${p2}`;
  } while (fs.existsSync(`adoptions/applications/${code}`));
  return code;
}

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.cookies['admin_token'] || req.body?.admin_token;
  if (token === ADMIN_TOKEN) return next();
  res.status(401).json({ success: false, error: 'Unauthorized' });
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN AUTH ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/admin/auth', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, error: 'Token required' });
  if (token === ADMIN_TOKEN) {
    res.cookie('admin_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'strict' });
    return res.json({ success: true, message: 'Authenticated' });
  }
  res.status(401).json({ success: false, error: 'Invalid token' });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

app.get('/api/admin/verify', adminAuth, (req, res) => {
  res.json({ success: true, authenticated: true });
});

// ══════════════════════════════════════════════════════════════════════════════
// PET MANAGEMENT ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// Publish pets (admin)
app.post('/api/pets/publish', adminAuth, (req, res, next) => {
  // We need to figure out category + pet_id before multer runs
  // Use a temporary multer that reads category first
  const rawBody = multer().none();
  rawBody(req, res, () => {
    const category = (req.body.category || '').toLowerCase().replace(/\s+/g, '-');
    if (!CATEGORIES.includes(category)) return res.status(400).json({ success: false, error: 'Invalid category' });

    const indexPath = `adoptions/pets/${category}/index.json`;
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const petId = generatePetId(category, index.pets);

    req.petInfo = { category, pet_id: petId };
    next();
  });
}, (req, res) => {
  // This won't work because multer already ran — use different approach
  res.status(500).json({ error: 'Use multipart publish endpoint' });
});

// Better: single pet publish endpoint
app.post('/api/pets/publish-pet', adminAuth, (req, res) => {
  // First pass: get category
  const tempUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  tempUpload.fields([{ name: 'single_image', maxCount: 1 }, { name: 'bulk_images', maxCount: 20 }])(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });

    try {
      const category = (req.body.category || '').toLowerCase().replace(/\s+/g, '-');
      if (!CATEGORIES.includes(category)) return res.status(400).json({ success: false, error: 'Invalid category' });

      const indexPath = `adoptions/pets/${category}/index.json`;
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const petId = generatePetId(category, index.pets);

      const petDir = `adoptions/pets/${category}/${petId}`;
      const bulkDir = `${petDir}/bulk_images`;
      fs.mkdirSync(bulkDir, { recursive: true });

      // Save single image
      let singleImageUrl = '/assets/images/pet-placeholder.jpg';
      if (req.files?.single_image?.[0]) {
        const f = req.files.single_image[0];
        const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
        const dest = `${petDir}/single_image${ext}`;
        fs.writeFileSync(dest, f.buffer);
        singleImageUrl = `/${dest}`;
      }

      // Save bulk images
      const bulkImageUrls = [];
      if (req.files?.bulk_images) {
        req.files.bulk_images.forEach((f, i) => {
          const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
          const fname = `image_${i + 1}${ext}`;
          const dest = `${bulkDir}/${fname}`;
          fs.writeFileSync(dest, f.buffer);
          bulkImageUrls.push(`/${dest}`);
        });
      }

      // Build pet.json
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const petJson = {
        pet_id: petId,
        category,
        name: sanitize(req.body.name || ''),
        species: sanitize(req.body.species || ''),
        breed: sanitize(req.body.breed || ''),
        age_years: parseFloat(req.body.age_years) || 0,
        size: sanitize(req.body.size || ''),
        description_short: sanitize(req.body.description_short || ''),
        description_full: sanitize(req.body.description_full || ''),
        adoption_fee: parseFloat(req.body.adoption_fee) || 0,
        health_info: sanitize(req.body.health_info || ''),
        single_image_url: singleImageUrl,
        bulk_images_url: `/${bulkDir}/`,
        bulk_images: bulkImageUrls,
        status: 'Available',
        created_at: now,
        updated_at: now
      };

      fs.writeFileSync(`${petDir}/pet.json`, JSON.stringify(petJson, null, 2));

      // Update category index
      index.pets.push(petId);
      index.count = index.pets.length;
      index.updated_at = now;
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

      res.json({ success: true, pet_id: petId, pet: petJson });
    } catch (e) {
      console.error('publish-pet error:', e);
      res.status(500).json({ success: false, error: 'Server error: ' + e.message });
    }
  });
});

// Get all pets in a category (admin + public)
app.get('/api/pets/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  if (!CATEGORIES.includes(category)) return res.status(400).json({ success: false, error: 'Invalid category' });

  try {
    const indexPath = `adoptions/pets/${category}/index.json`;
    if (!fs.existsSync(indexPath)) return res.json({ success: true, pets: [] });
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const pets = [];
    for (const petId of index.pets) {
      const petPath = `adoptions/pets/${category}/${petId}/pet.json`;
      if (fs.existsSync(petPath)) {
        pets.push(JSON.parse(fs.readFileSync(petPath, 'utf8')));
      }
    }
    res.json({ success: true, pets });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get single pet
app.get('/api/pets/:category/:pet_id', (req, res) => {
  const { category, pet_id } = req.params;
  const petPath = `adoptions/pets/${category}/${pet_id}/pet.json`;
  if (!fs.existsSync(petPath)) return res.status(404).json({ success: false, error: 'Pet not found' });
  try {
    const pet = JSON.parse(fs.readFileSync(petPath, 'utf8'));
    res.json({ success: true, pet });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update pet (admin)
app.put('/api/pets/:category/:pet_id', adminAuth, (req, res) => {
  const tempUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  tempUpload.fields([{ name: 'single_image', maxCount: 1 }, { name: 'bulk_images', maxCount: 20 }])(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });

    const { category, pet_id } = req.params;
    const petPath = `adoptions/pets/${category}/${pet_id}/pet.json`;
    if (!fs.existsSync(petPath)) return res.status(404).json({ success: false, error: 'Pet not found' });

    try {
      const pet = JSON.parse(fs.readFileSync(petPath, 'utf8'));
      const petDir = `adoptions/pets/${category}/${pet_id}`;
      const bulkDir = `${petDir}/bulk_images`;
      fs.mkdirSync(bulkDir, { recursive: true });

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      if (req.body.name !== undefined) pet.name = sanitize(req.body.name);
      if (req.body.breed !== undefined) pet.breed = sanitize(req.body.breed);
      if (req.body.age_years !== undefined) pet.age_years = parseFloat(req.body.age_years) || 0;
      if (req.body.size !== undefined) pet.size = sanitize(req.body.size);
      if (req.body.description_short !== undefined) pet.description_short = sanitize(req.body.description_short);
      if (req.body.description_full !== undefined) pet.description_full = sanitize(req.body.description_full);
      if (req.body.adoption_fee !== undefined) pet.adoption_fee = parseFloat(req.body.adoption_fee) || 0;
      if (req.body.health_info !== undefined) pet.health_info = sanitize(req.body.health_info);
      if (req.body.status !== undefined) pet.status = req.body.status;
      pet.updated_at = now;

      // Replace single image if provided
      if (req.files?.single_image?.[0]) {
        const f = req.files.single_image[0];
        const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
        const dest = `${petDir}/single_image${ext}`;
        fs.writeFileSync(dest, f.buffer);
        pet.single_image_url = `/${dest}`;
      }

      // Replace bulk images if provided
      if (req.files?.bulk_images && req.files.bulk_images.length > 0) {
        // Clear old bulk images
        if (fs.existsSync(bulkDir)) {
          fs.readdirSync(bulkDir).forEach(f => fs.unlinkSync(`${bulkDir}/${f}`));
        }
        const bulkImageUrls = [];
        req.files.bulk_images.forEach((f, i) => {
          const ext = path.extname(f.originalname).toLowerCase() || '.jpg';
          const fname = `image_${i + 1}${ext}`;
          const dest = `${bulkDir}/${fname}`;
          fs.writeFileSync(dest, f.buffer);
          bulkImageUrls.push(`/${dest}`);
        });
        pet.bulk_images = bulkImageUrls;
      }

      fs.writeFileSync(petPath, JSON.stringify(pet, null, 2));
      res.json({ success: true, pet });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });
});

// Delete pet (admin)
app.delete('/api/pets/:category/:pet_id', adminAuth, (req, res) => {
  const { category, pet_id } = req.params;
  const petDir = `adoptions/pets/${category}/${pet_id}`;
  const indexPath = `adoptions/pets/${category}/index.json`;

  try {
    if (!fs.existsSync(petDir)) return res.status(404).json({ success: false, error: 'Pet not found' });

    // Remove directory recursively
    fs.rmSync(petDir, { recursive: true, force: true });

    // Update index
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    index.pets = index.pets.filter(id => id !== pet_id);
    index.count = index.pets.length;
    index.updated_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

    res.json({ success: true, message: `Pet ${pet_id} deleted.` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ADOPTION APPLICATION ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// Submit adoption application
app.post('/api/adoption/submit', (req, res) => {
  const tempUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
  tempUpload.fields([
    { name: 'file_id', maxCount: 5 },
    { name: 'file_address', maxCount: 5 },
    { name: 'file_vet', maxCount: 5 }
  ])(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });

    try {
      const code = generateAdoptionCode();
      const appDir = `adoptions/applications/${code}`;
      const uploadsDir = `${appDir}/uploads`;
      fs.mkdirSync(uploadsDir, { recursive: true });

      // Save uploaded documents
      const uploadedFiles = {};
      ['file_id', 'file_address', 'file_vet'].forEach(field => {
        if (req.files?.[field]) {
          uploadedFiles[field] = [];
          req.files[field].forEach((f, i) => {
            const ext = path.extname(f.originalname).toLowerCase();
            const fname = `${field}_${i + 1}${ext}`;
            fs.writeFileSync(`${uploadsDir}/${fname}`, f.buffer);
            uploadedFiles[field].push(fname);
          });
        }
      });

      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      const application = {
        adoption_code: code,
        pet_id: sanitize(req.body.pet_id || ''),
        pet_name: sanitize(req.body.pet_name || ''),
        pet_image_url: sanitize(req.body.pet_image_url || ''),
        pet_category: sanitize(req.body.pet_category || ''),
        pet_breed: sanitize(req.body.pet_breed || ''),
        pet_age: sanitize(req.body.pet_age || ''),
        pet_size: sanitize(req.body.pet_size || ''),
        adoption_fee: sanitize(req.body.adoption_fee || ''),
        applicant_name: sanitize(req.body.name || ''),
        applicant_email: sanitize(req.body.user_email || ''),
        applicant_phone: sanitize(req.body.phone || ''),
        address: sanitize(req.body.address || ''),
        apartment: sanitize(req.body.apt || ''),
        city: sanitize(req.body.city || ''),
        state: sanitize(req.body.state || ''),
        zip: sanitize(req.body.zip || ''),
        id_number: sanitize(req.body.id_number || ''),
        spouse: sanitize(req.body.spouse || ''),
        employment_status: sanitize(req.body.employment_status || ''),
        reference_date: sanitize(req.body.top_date || ''),
        residence_type: sanitize(req.body.residence_type || ''),
        landlord_allows: sanitize(req.body.landlord_allows || ''),
        landlord_contact: sanitize(req.body.landlord_contact || ''),
        home_type: sanitize(req.body.home_type || ''),
        time_at_address: sanitize(req.body.time_at_address || ''),
        household_list: sanitize(req.body.household_list || ''),
        past_animals: sanitize(req.body.past_animals || ''),
        can_afford: sanitize(req.body.can_afford || ''),
        have_vet: sanitize(req.body.have_vet || ''),
        vet_name: sanitize(req.body.vet_name || ''),
        vet_address: sanitize(req.body.vet_address || ''),
        vet_phone: sanitize(req.body.vet_phone || ''),
        allow_contact_vet: sanitize(req.body.allow_contact_vet || ''),
        where_keep: sanitize(req.body.where_keep || ''),
        inside_plan: sanitize(req.body.inside_plan || ''),
        outside_plan: sanitize(req.body.outside_plan || ''),
        introduce_existing: sanitize(req.body.introduce_existing || ''),
        handle_undesirable: sanitize(req.body.handle_undesirable || ''),
        want_adopt: sanitize(req.body.want_adopt || ''),
        sex_pref: sanitize(req.body.sex_pref || ''),
        reason: Array.isArray(req.body['reason[]']) ? req.body['reason[]'].map(sanitize) : (req.body['reason[]'] ? [sanitize(req.body['reason[]'])] : []),
        hear: Array.isArray(req.body['hear[]']) ? req.body['hear[]'].map(sanitize) : (req.body['hear[]'] ? [sanitize(req.body['hear[]'])] : []),
        primary_caregiver: sanitize(req.body.primary_caregiver || ''),
        additional_info: sanitize(req.body.additional_info || ''),
        submission_date: sanitize(req.body.submission_date || ''),
        signature_data: req.body.signature_data || null,
        uploaded_files: uploadedFiles,
        status: 'PENDING',
        applied_at: now,
        approved_at: null,
        checkout_url: null,
        rejection_notes: null
      };

      const metadata = {
        adoption_code: code,
        pet_id: application.pet_id,
        pet_name: application.pet_name,
        applicant_name: application.applicant_name,
        applicant_email: application.applicant_email,
        status: 'PENDING',
        created_at: now
      };

      fs.writeFileSync(`${appDir}/application.json`, JSON.stringify(application, null, 2));
      fs.writeFileSync(`${appDir}/metadata.json`, JSON.stringify(metadata, null, 2));

      res.json({ success: true, adoption_code: code, message: 'Application submitted successfully.' });
    } catch (e) {
      console.error('submit-adoption error:', e);
      res.status(500).json({ success: false, error: 'Server error: ' + e.message });
    }
  });
});

// Get adoption status
app.get('/api/adoption/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  if (!/^AD-\d{5}-\d{4}$/.test(code)) return res.status(400).json({ success: false, error: 'Invalid adoption code format.' });

  const appPath = `adoptions/applications/${code}/application.json`;
  if (!fs.existsSync(appPath)) return res.status(404).json({ success: false, error: 'Adoption code not found. Please check and try again.' });

  try {
    const app_data = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    const response = {
      success: true,
      adoption_code: code,
      status: app_data.status,
      applicant_name: app_data.applicant_name,
      pet_name: app_data.pet_name,
      pet_image_url: app_data.pet_image_url,
      pet_id: app_data.pet_id,
      applied_at: app_data.applied_at
    };
    if (app_data.status === 'APPROVED') {
      response.checkout_url = app_data.checkout_url;
      response.approved_at = app_data.approved_at;
    }
    if (app_data.status === 'REJECTED') {
      response.rejection_notes = app_data.rejection_notes;
    }
    res.json(response);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Update adoption status (admin: approve/reject)
app.put('/api/adoption/:code', adminAuth, (req, res) => {
  const code = req.params.code.toUpperCase();
  const appPath = `adoptions/applications/${code}/application.json`;
  if (!fs.existsSync(appPath)) return res.status(404).json({ success: false, error: 'Application not found.' });

  try {
    const application = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    const { status, checkout_url, rejection_notes } = req.body;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (status === 'APPROVED') {
      application.status = 'APPROVED';
      application.checkout_url = sanitize(checkout_url || '');
      application.approved_at = now;

      // Mark pet as Adopted
      if (application.pet_id && application.pet_category) {
        const petPath = `adoptions/pets/${application.pet_category}/${application.pet_id}/pet.json`;
        if (fs.existsSync(petPath)) {
          const pet = JSON.parse(fs.readFileSync(petPath, 'utf8'));
          pet.status = 'Adopted';
          pet.updated_at = now;
          fs.writeFileSync(petPath, JSON.stringify(pet, null, 2));
        }
      }
    } else if (status === 'REJECTED') {
      application.status = 'REJECTED';
      application.rejection_notes = sanitize(rejection_notes || '');
    } else {
      return res.status(400).json({ success: false, error: 'Status must be APPROVED or REJECTED.' });
    }

    fs.writeFileSync(appPath, JSON.stringify(application, null, 2));

    // Update metadata
    const metaPath = `adoptions/applications/${code}/metadata.json`;
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      meta.status = application.status;
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }

    res.json({ success: true, message: `Application ${status}.`, status: application.status });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get all applications (admin)
app.get('/api/admin/applications', adminAuth, (req, res) => {
  try {
    const appsDir = 'adoptions/applications';
    if (!fs.existsSync(appsDir)) return res.json({ success: true, applications: [] });
    const codes = fs.readdirSync(appsDir).filter(f => /^AD-\d{5}-\d{4}$/.test(f));
    const applications = [];
    for (const code of codes) {
      const metaPath = `${appsDir}/${code}/metadata.json`;
      const appPath = `${appsDir}/${code}/application.json`;
      if (fs.existsSync(appPath)) {
        const app_data = JSON.parse(fs.readFileSync(appPath, 'utf8'));
        applications.push({
          adoption_code: code,
          applicant_name: app_data.applicant_name,
          applicant_email: app_data.applicant_email,
          pet_name: app_data.pet_name,
          pet_id: app_data.pet_id,
          pet_category: app_data.pet_category,
          status: app_data.status,
          applied_at: app_data.applied_at,
          approved_at: app_data.approved_at,
          checkout_url: app_data.checkout_url,
          rejection_notes: app_data.rejection_notes
        });
      }
    }
    // Sort newest first
    applications.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at));
    res.json({ success: true, applications });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get single application detail (admin)
app.get('/api/admin/applications/:code', adminAuth, (req, res) => {
  const code = req.params.code.toUpperCase();
  const appPath = `adoptions/applications/${code}/application.json`;
  if (!fs.existsSync(appPath)) return res.status(404).json({ success: false, error: 'Not found.' });
  try {
    const app_data = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    res.json({ success: true, application: app_data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Dashboard stats (admin)
app.get('/api/admin/stats', adminAuth, (req, res) => {
  try {
    const stats = { total_available: 0, pending_applications: 0, approved_applications: 0, rejected_applications: 0, adopted_this_month: 0 };
    const thisMonth = new Date().toISOString().slice(0, 7);

    CATEGORIES.forEach(cat => {
      const indexPath = `adoptions/pets/${cat}/index.json`;
      if (!fs.existsSync(indexPath)) return;
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      index.pets.forEach(petId => {
        const petPath = `adoptions/pets/${cat}/${petId}/pet.json`;
        if (!fs.existsSync(petPath)) return;
        const pet = JSON.parse(fs.readFileSync(petPath, 'utf8'));
        if (pet.status === 'Available') stats.total_available++;
        if (pet.status === 'Adopted' && pet.updated_at && pet.updated_at.startsWith(thisMonth)) stats.adopted_this_month++;
      });
    });

    const appsDir = 'adoptions/applications';
    if (fs.existsSync(appsDir)) {
      fs.readdirSync(appsDir).filter(f => /^AD-\d{5}-\d{4}$/.test(f)).forEach(code => {
        const metaPath = `${appsDir}/${code}/metadata.json`;
        if (!fs.existsSync(metaPath)) return;
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        if (meta.status === 'PENDING') stats.pending_applications++;
        else if (meta.status === 'APPROVED') stats.approved_applications++;
        else if (meta.status === 'REJECTED') stats.rejected_applications++;
      });
    }

    res.json({ success: true, stats });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Temp file upload (for adoption form pre-upload)
app.post('/upload-temp', (req, res) => {
  const tempUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
  tempUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const token = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(req.file.originalname).toLowerCase();
    const tmpDir = 'adoptions/temp';
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(`${tmpDir}/${token}${ext}`, req.file.buffer);
    res.json({ success: true, token: token + ext });
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

const TESTIMONIALS_FILE = 'testimonials/testimonials.json';

function readTestimonials() {
  if (!fs.existsSync(TESTIMONIALS_FILE)) return { testimonials: [] };
  try { return JSON.parse(fs.readFileSync(TESTIMONIALS_FILE, 'utf8')); }
  catch (e) { return { testimonials: [] }; }
}

function writeTestimonials(data) {
  fs.mkdirSync('testimonials', { recursive: true });
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(data, null, 2));
}

// GET all testimonials (public)
app.get('/api/testimonials', (req, res) => {
  const data = readTestimonials();
  res.json({ success: true, testimonials: data.testimonials || [] });
});

// POST new testimonial (public submission)
app.post('/api/testimonials', (req, res) => {
  try {
    const name   = sanitize((req.body.name || '').toString().trim());
    const email  = sanitize((req.body.email || '').toString().trim());
    const rating = parseInt(req.body.rating) || 0;
    const text   = sanitize((req.body.text || '').toString().trim());

    if (!name || name.length < 2) return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Valid email required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be 1–5' });
    if (!text || text.length < 10) return res.status(400).json({ success: false, message: 'Testimonial must be at least 10 characters' });
    if (text.length > 1000) return res.status(400).json({ success: false, message: 'Testimonial must be under 1000 characters' });

    const data = readTestimonials();
    const existing = data.testimonials || [];
    const ids = existing.map(t => t.id);
    const nextId = ids.length ? Math.max(...ids) + 1 : 1;

    const parts = name.trim().split(' ');
    const initials = (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    const colorMap = { 5: '#10b981', 4: '#0ea5e9', 3: '#9ca3af', 2: '#ef4444', 1: '#dc2626' };

    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const newT = {
      id: nextId,
      name,
      email,
      date: dateStr,
      rating,
      text,
      initials,
      color: colorMap[rating] || '#6b7280',
      reply: null
    };

    existing.push(newT);
    data.testimonials = existing;
    writeTestimonials(data);

    res.status(201).json({ success: true, message: 'Testimonial submitted successfully!', testimonial: newT });
  } catch (e) {
    console.error('testimonials POST error:', e);
    res.status(500).json({ success: false, message: 'Server error: ' + e.message });
  }
});

// DELETE testimonial (admin)
app.delete('/api/testimonials/:id', adminAuth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readTestimonials();
    const before = (data.testimonials || []).length;
    data.testimonials = (data.testimonials || []).filter(t => t.id !== id);
    if (data.testimonials.length === before) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    writeTestimonials(data);
    res.json({ success: true, message: `Testimonial ${id} deleted.` });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pet Center Adoption Website running on port ${PORT}`);
  console.log(`Admin token: ${ADMIN_TOKEN}`);
});
