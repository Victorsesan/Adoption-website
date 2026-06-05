/* ═══════════════════════════════════════════════════════════════════════════
   Pet Center — admin.js
   Admin dashboard: auth, pet management, application review, stats
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const CATEGORIES = ['dogs', 'cats', 'birds', 'reptiles', 'small-mammals'];
const CAT_SPECIES = { dogs: 'Dog', cats: 'Cat', birds: 'Bird', reptiles: 'Reptile', 'small-mammals': 'Small Mammal' };
const CAT_LABELS = { dogs: 'Dogs', cats: 'Cats', birds: 'Birds', reptiles: 'Reptiles', 'small-mammals': 'Small Mammals' };

let adminToken = sessionStorage.getItem('admin_token') || '';
let currentPanel = 'dashboard';
let petForms = [];
let publishCategory = '';
let allApplications = [];
let allPets = {};

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function adminLogin() {
  const tokenInput = document.getElementById('adminTokenInput');
  const token = tokenInput?.value?.trim();
  if (!token) { showLoginError('Please enter your admin token.'); return; }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="pc-spinner"></span> Verifying...`;

  try {
    const fd = new FormData();
    fd.append('token', token);
    fd.append('action', 'login');
    const res = await fetch('/admin/admin-auth.php', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      adminToken = token;
      sessionStorage.setItem('admin_token', token);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboardScreen').style.display = 'flex';
      initDashboard();
    } else {
      showLoginError('Invalid token. Access denied.');
      btn.disabled = false;
      btn.textContent = 'Access Dashboard';
    }
  } catch {
    showLoginError('Connection error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Access Dashboard';
  }
}

function showLoginError(msg) {
  const el = document.getElementById('loginError');
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

async function checkExistingAuth() {
  if (!adminToken) return;
  try {
    const res = await fetch('/admin/admin-auth.php?action=verify', { headers: { 'X-Admin-Token': adminToken } });
    const data = await res.json();
    if (data.success) {
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('dashboardScreen').style.display = 'flex';
      initDashboard();
    } else {
      adminToken = '';
      sessionStorage.removeItem('admin_token');
    }
  } catch {}
}

async function adminLogout() {
  await fetch('/admin/admin-auth.php?action=logout', { method: 'POST' });
  sessionStorage.removeItem('admin_token');
  adminToken = '';
  document.getElementById('dashboardScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

// ─── Init dashboard ────────────────────────────────────────────────────────────
function initDashboard() {
  loadStats();
  switchPanel('dashboard');
}

// ─── Panel switching ───────────────────────────────────────────────────────────
function switchPanel(panel) {
  currentPanel = panel;
  document.querySelectorAll('.admin-nav__item').forEach(b => {
    b.classList.toggle('active', b.dataset.panel === panel);
  });
  document.querySelectorAll('.admin-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${panel}`);
  });
  const title = document.getElementById('panelTitle');
  const titles = { dashboard: 'Dashboard', publish: 'Publish Pets', edit: 'Edit Pets', applications: 'Applications' };
  if (title) title.textContent = titles[panel] || panel;

  if (panel === 'dashboard') loadStats();
  if (panel === 'edit') loadEditPanel();
  if (panel === 'applications') loadApplicationsPanel();
}

// ─── Dashboard stats ────────────────────────────────────────────────────────────
async function loadStats() {
  try {
    const data = await adminFetch('/admin/stats.php');
    const s = data.stats || {};
    setStatEl('statAvailable', s.total_available);
    setStatEl('statPending', s.pending_applications);
    setStatEl('statApproved', s.approved_applications);
    setStatEl('statRejected', s.rejected_applications);
    setStatEl('statAdopted', s.adopted_this_month);
  } catch (e) {
    console.error('Stats error:', e);
  }
}
function setStatEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val ?? 0; }

// ─── Publish panel ─────────────────────────────────────────────────────────────
function selectPublishCategory(cat) {
  publishCategory = cat;
  petForms = [];
  document.getElementById('publishCategoryLabel').textContent = CAT_LABELS[cat] || cat;
  document.getElementById('publishFormArea').style.display = 'block';
  document.getElementById('petFormsList').innerHTML = '';
  addPetForm();
}

function addPetForm() {
  const idx = petForms.length;
  petForms.push({ id: idx, files: { single: null, bulk: [] } });
  const formsEl = document.getElementById('petFormsList');
  const card = document.createElement('div');
  card.className = 'pet-form-card slide-up';
  card.id = `petForm_${idx}`;
  card.innerHTML = `
    <div class="pet-form-card__number">Pet ${idx + 1}</div>
    ${idx > 0 ? `<button class="pet-form-card__delete" onclick="removePetForm(${idx})">Remove</button>` : ''}
    <div class="pc-form-row">
      <div class="pc-form-group">
        <label class="pc-form-label">Pet Name *</label>
        <input class="pc-form-input" name="name" placeholder="e.g. Buddy" required>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Breed *</label>
        <input class="pc-form-input" name="breed" placeholder="e.g. Golden Retriever" required>
      </div>
    </div>
    <div class="pc-form-row">
      <div class="pc-form-group">
        <label class="pc-form-label">Age (years) *</label>
        <input class="pc-form-input" name="age_years" type="number" step="0.5" min="0" placeholder="e.g. 2" required>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Size *</label>
        <select class="pc-form-select" name="size" required>
          <option value="">Select size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Adoption Fee ($) *</label>
        <input class="pc-form-input" name="adoption_fee" type="number" min="0" placeholder="e.g. 150" required>
      </div>
    </div>
    <div class="pc-form-group">
      <label class="pc-form-label">Short Description *</label>
      <input class="pc-form-input" name="description_short" placeholder="e.g. Friendly and loves to play" required>
    </div>
    <div class="pc-form-group">
      <label class="pc-form-label">Full Description</label>
      <textarea class="pc-form-textarea" name="description_full" placeholder="Detailed info about personality, energy level, ideal home..."></textarea>
    </div>
    <div class="pc-form-group">
      <label class="pc-form-label">Health Info</label>
      <input class="pc-form-input" name="health_info" placeholder="e.g. Vaccinated, microchipped, spayed/neutered">
    </div>
    <div class="pc-form-row">
      <div class="pc-form-group">
        <label class="pc-form-label">Single Image * (for grid display)</label>
        <div class="pc-file-drop" id="singleDrop_${idx}">
          <input type="file" accept="image/*" id="singleInput_${idx}" onchange="handleSingleImg(${idx}, this)">
          <div class="pc-file-drop__icon">${PC.icons.file}</div>
          <div class="pc-file-drop__text">Click or drag — <strong>1 image</strong></div>
        </div>
        <div id="singlePreview_${idx}" style="margin-top:8px;"></div>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Gallery Images (for single pet page)</label>
        <div class="pc-file-drop" id="bulkDrop_${idx}">
          <input type="file" accept="image/*" multiple id="bulkInput_${idx}" onchange="handleBulkImgs(${idx}, this)">
          <div class="pc-file-drop__icon">${PC.icons.file}</div>
          <div class="pc-file-drop__text">Click or drag — <strong>Multiple images</strong></div>
        </div>
        <div id="bulkPreview_${idx}" class="pc-file-preview" style="margin-top:8px;"></div>
      </div>
    </div>`;
  formsEl.appendChild(card);
  updatePublishCount();
  setupDragDrop(idx);
}

function setupDragDrop(idx) {
  ['single', 'bulk'].forEach(type => {
    const drop = document.getElementById(`${type}Drop_${idx}`);
    if (!drop) return;
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
    drop.addEventListener('drop', e => {
      e.preventDefault(); drop.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files);
      if (type === 'single') handleSingleImgFiles(idx, files);
      else handleBulkImgFiles(idx, files);
    });
  });
}

function handleSingleImg(idx, input) { handleSingleImgFiles(idx, Array.from(input.files)); }
function handleSingleImgFiles(idx, files) {
  if (!files.length) return;
  petForms[idx].files.single = files[0];
  const prev = document.getElementById(`singlePreview_${idx}`);
  if (prev) {
    const url = URL.createObjectURL(files[0]);
    prev.innerHTML = `<img src="${url}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`;
  }
}
function handleBulkImgs(idx, input) { handleBulkImgFiles(idx, Array.from(input.files)); }
function handleBulkImgFiles(idx, files) {
  petForms[idx].files.bulk.push(...files);
  renderBulkPreview(idx);
}
function renderBulkPreview(idx) {
  const prev = document.getElementById(`bulkPreview_${idx}`);
  if (!prev) return;
  prev.innerHTML = petForms[idx].files.bulk.map((f, i) =>
    `<div class="pc-file-preview__item">
      <img src="${URL.createObjectURL(f)}" alt="">
      <button class="pc-file-preview__remove" onclick="removeBulkImg(${idx},${i})">×</button>
    </div>`
  ).join('');
}
function removeBulkImg(idx, i) { petForms[idx].files.bulk.splice(i, 1); renderBulkPreview(idx); }
function removePetForm(idx) {
  document.getElementById(`petForm_${idx}`)?.remove();
  petForms[idx] = null;
  updatePublishCount();
}
function updatePublishCount() {
  const active = petForms.filter(Boolean).length;
  const btn = document.getElementById('publishAllBtn');
  if (btn) btn.textContent = `Publish All ${active} Pet${active !== 1 ? 's' : ''}`;
}

async function publishAll() {
  const activeForms = petForms.map((f, i) => f ? { form: f, el: document.getElementById(`petForm_${i}`) } : null).filter(Boolean);
  if (!activeForms.length) { PC.toast('No pets to publish.', 'error'); return; }

  const btn = document.getElementById('publishAllBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="pc-spinner"></span> Publishing...`;

  const results = [];
  for (const { form, el } of activeForms) {
    const fd = new FormData();
    fd.append('category', publishCategory);
    fd.append('species', CAT_SPECIES[publishCategory] || publishCategory);
    el.querySelectorAll('input[name], select[name], textarea[name]').forEach(inp => {
      fd.append(inp.name, inp.value);
    });
    if (form.files.single) fd.append('single_image', form.files.single);
    form.files.bulk.forEach(f => fd.append('bulk_images', f));

    try {
      const res = await adminFetch('/admin/publish-pet.php', { method: 'POST', body: fd, headers: {} });
      if (res.success) results.push({ ok: true, name: res.pet?.name, id: res.pet_id });
      else results.push({ ok: false, error: res.error });
    } catch (e) {
      results.push({ ok: false, error: e.message });
    }
  }

  btn.disabled = false;
  updatePublishCount();
  btn.innerHTML = `Publish All ${activeForms.length} Pet${activeForms.length !== 1 ? 's' : ''}`;

  const ok = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);

  let msg = ok.length ? `Published: ${ok.map(r => r.name + ' (' + r.id + ')').join(', ')}` : '';
  if (fail.length) msg += `\nFailed: ${fail.map(r => r.error).join(', ')}`;

  showAdminModal('Publish Complete', `
    ${ok.length ? `<div class="pc-alert pc-alert--success show">${ok.length} pet${ok.length !== 1 ? 's' : ''} published successfully!</div>` : ''}
    ${fail.length ? `<div class="pc-alert pc-alert--error show" style="margin-top:8px;">${fail.length} failed. Please check and retry.</div>` : ''}
    ${ok.map(r => `<div style="margin-top:8px;font-size:14px;color:#0d7c4a;font-weight:600;">${PC.esc(r.name)} — ${PC.esc(r.id)}</div>`).join('')}
    <button class="pc-btn pc-btn--primary" style="margin-top:20px;" onclick="PC.modal.closeAll();switchPanel('edit');">View Published Pets</button>
  `);

  if (ok.length) {
    // Reset publish form
    document.getElementById('petFormsList').innerHTML = '';
    petForms = [];
    addPetForm();
    loadStats();
  }
}

// ─── Edit Panel ────────────────────────────────────────────────────────────────
async function loadEditPanel() {
  const catSel = document.getElementById('editCategorySel');
  if (catSel) catSel.value = catSel.value || 'dogs';
  await loadEditCategoryPets(catSel?.value || 'dogs');
}

async function loadEditCategoryPets(category) {
  const tableBody = document.getElementById('editPetsTable');
  if (!tableBody) return;
  tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#7a6d5f;">Loading...</td></tr>`;

  try {
    const data = await adminFetch(`/admin/get-pets.php?category=${encodeURIComponent(category)}`);
    const pets = data.pets || [];
    allPets[category] = pets;

    if (!pets.length) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:#7a6d5f;">No pets published in ${CAT_LABELS[category]}.</td></tr>`;
      return;
    }

    tableBody.innerHTML = pets.map(p => `
      <tr>
        <td style="display:flex;align-items:center;gap:12px;">
          <img src="${PC.esc(p.single_image_url || '/assets/images/pet-placeholder.jpg')}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;" onerror="this.src='/assets/images/pet-placeholder.jpg'">
          <strong style="color:#10214b;">${PC.esc(p.name)}</strong>
        </td>
        <td>${PC.esc(p.breed)}</td>
        <td>${PC.fmt(p.adoption_fee)}</td>
        <td><span class="pc-badge pc-badge--${p.status === 'Available' ? 'available' : 'adopted'}">${PC.esc(p.status)}</span></td>
        <td style="display:flex;gap:8px;">
          <button class="pc-btn pc-btn--ghost pc-btn--sm" onclick="openEditPet('${PC.esc(p.pet_id)}','${PC.esc(category)}')">
            <span style="width:14px;height:14px;">${PC.icons.edit}</span> Edit
          </button>
          <button class="pc-btn pc-btn--sm" style="background:#fdecea;color:#c0392b;" onclick="confirmDelete('${PC.esc(p.pet_id)}','${PC.esc(category)}','${PC.esc(p.name)}')">
            <span style="width:14px;height:14px;">${PC.icons.trash}</span>
          </button>
        </td>
      </tr>`).join('');
  } catch (e) {
    tableBody.innerHTML = `<tr><td colspan="5" style="color:#c0392b;padding:20px;">Error loading pets: ${PC.esc(e.message)}</td></tr>`;
  }
}

async function openEditPet(petId, category) {
  const pets = allPets[category] || [];
  let pet = pets.find(p => p.pet_id === petId);
  if (!pet) {
    const data = await adminFetch(`/admin/get-pets.php?category=${encodeURIComponent(category)}&pet_id=${encodeURIComponent(petId)}`);
    pet = data.pet;
  }
  if (!pet) return;

  showAdminModal('Edit Pet', `
    <form id="editPetForm">
      <input type="hidden" name="pet_id" value="${PC.esc(pet.pet_id)}">
      <input type="hidden" name="category" value="${PC.esc(category)}">
      <div class="pc-form-row">
        <div class="pc-form-group">
          <label class="pc-form-label">Pet Name *</label>
          <input class="pc-form-input" name="name" value="${PC.esc(pet.name)}" required>
        </div>
        <div class="pc-form-group">
          <label class="pc-form-label">Breed *</label>
          <input class="pc-form-input" name="breed" value="${PC.esc(pet.breed)}" required>
        </div>
      </div>
      <div class="pc-form-row">
        <div class="pc-form-group">
          <label class="pc-form-label">Age (years)</label>
          <input class="pc-form-input" type="number" step="0.5" min="0" name="age_years" value="${PC.esc(pet.age_years)}">
        </div>
        <div class="pc-form-group">
          <label class="pc-form-label">Size</label>
          <select class="pc-form-select" name="size">
            ${['Small','Medium','Large'].map(s => `<option value="${s}" ${pet.size===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="pc-form-group">
          <label class="pc-form-label">Adoption Fee ($)</label>
          <input class="pc-form-input" type="number" min="0" name="adoption_fee" value="${PC.esc(pet.adoption_fee)}">
        </div>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Short Description</label>
        <input class="pc-form-input" name="description_short" value="${PC.esc(pet.description_short)}">
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Full Description</label>
        <textarea class="pc-form-textarea" name="description_full">${PC.esc(pet.description_full)}</textarea>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Health Info</label>
        <input class="pc-form-input" name="health_info" value="${PC.esc(pet.health_info)}">
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Status</label>
        <select class="pc-form-select" name="status">
          <option value="Available" ${pet.status==='Available'?'selected':''}>Available</option>
          <option value="Adopted" ${pet.status==='Adopted'?'selected':''}>Adopted</option>
          <option value="Pending" ${pet.status==='Pending'?'selected':''}>Pending</option>
        </select>
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Replace Single Image (optional)</label>
        <input type="file" name="single_image" accept="image/*" class="pc-form-input" style="padding:8px;">
      </div>
      <div class="pc-form-group">
        <label class="pc-form-label">Replace Gallery Images (optional)</label>
        <input type="file" name="bulk_images" accept="image/*" multiple class="pc-form-input" style="padding:8px;">
      </div>
      <div style="display:flex;gap:12px;margin-top:20px;">
        <button type="button" class="pc-btn pc-btn--primary" onclick="saveEditPet('${PC.esc(petId)}','${PC.esc(category)}')">Save Changes</button>
        <button type="button" class="pc-btn pc-btn--ghost" onclick="PC.modal.closeAll()">Cancel</button>
      </div>
    </form>`, true);
}

async function saveEditPet(petId, category) {
  const form = document.getElementById('editPetForm');
  if (!form) return;
  const fd = new FormData(form);
  const btn = document.querySelector('#adminModal .pc-btn--primary');
  if (btn) { btn.disabled = true; btn.innerHTML = `<span class="pc-spinner"></span> Saving...`; }

  try {
    const res = await adminFetch('/admin/update-pet.php', { method: 'POST', body: fd, headers: {} });
    if (res.success) {
      PC.toast('Pet updated successfully!');
      PC.modal.closeAll();
      await loadEditCategoryPets(category);
    } else {
      PC.toast(res.error || 'Save failed.', 'error');
    }
  } catch (e) {
    PC.toast('Error: ' + e.message, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; }
  }
}

function confirmDelete(petId, category, name) {
  showAdminModal('Delete Pet', `
    <p style="color:#2c2416;font-size:15px;">Are you sure you want to delete <strong>${PC.esc(name)}</strong>?</p>
    <p style="color:#c0392b;font-size:13px;margin-top:8px;">This action cannot be undone. The pet folder and all images will be permanently removed.</p>
    <div style="display:flex;gap:12px;margin-top:24px;">
      <button class="pc-btn" style="background:#c0392b;color:#fff;" onclick="deletePet('${PC.esc(petId)}','${PC.esc(category)}','${PC.esc(name)}')">Delete ${PC.esc(name)}</button>
      <button class="pc-btn pc-btn--ghost" onclick="PC.modal.closeAll()">Cancel</button>
    </div>`);
}

async function deletePet(petId, category, name) {
  try {
    const fd = new FormData();
    fd.append('pet_id', petId);
    fd.append('category', category);
    const res = await adminFetch('/admin/delete-pet.php', { method: 'POST', body: fd, headers: {} });
    if (res.success) {
      PC.toast(`${name} deleted.`);
      PC.modal.closeAll();
      await loadEditCategoryPets(category);
      loadStats();
    } else {
      PC.toast(res.error || 'Delete failed.', 'error');
    }
  } catch (e) {
    PC.toast('Error: ' + e.message, 'error');
  }
}

// ─── Applications Panel ────────────────────────────────────────────────────────
async function loadApplicationsPanel() {
  const tbody = document.getElementById('appsTable');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#7a6d5f;">Loading...</td></tr>`;

  try {
    const data = await adminFetch('/admin/get-applications.php');
    allApplications = data.applications || [];
    renderApplicationsTable(allApplications);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:#c0392b;padding:20px;">Error: ${PC.esc(e.message)}</td></tr>`;
  }
}

function renderApplicationsTable(apps) {
  const tbody = document.getElementById('appsTable');
  if (!tbody) return;
  const statusFilter = document.getElementById('appStatusFilter')?.value || '';
  const catFilter = document.getElementById('appCatFilter')?.value || '';

  const filtered = apps.filter(a => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (catFilter && a.pet_category !== catFilter) return false;
    return true;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#7a6d5f;">No applications found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td><strong style="color:#10214b;">${PC.esc(a.applicant_name)}</strong><br><span style="font-size:12px;color:#7a6d5f;">${PC.esc(a.applicant_email)}</span></td>
      <td>${PC.esc(a.pet_name)}<br><span style="font-size:12px;color:#7a6d5f;">${PC.esc(a.pet_id)}</span></td>
      <td>${PC.esc(a.applied_at?.slice(0,10) || '')}</td>
      <td><span class="pc-badge pc-badge--${(a.status||'').toLowerCase()}">${PC.esc(a.status)}</span></td>
      <td><strong style="color:#10214b;">${PC.esc(a.adoption_code)}</strong></td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="pc-btn pc-btn--ghost pc-btn--sm" onclick="viewApplication('${PC.esc(a.adoption_code)}')">View</button>
          ${a.status === 'PENDING' ? `
            <button class="pc-btn pc-btn--sm" style="background:#e6f7ef;color:#0d7c4a;" onclick="approveApp('${PC.esc(a.adoption_code)}','${PC.esc(a.applicant_name)}','${PC.esc(a.pet_name)}')">Approve</button>
            <button class="pc-btn pc-btn--sm" style="background:#fdecea;color:#c0392b;" onclick="rejectApp('${PC.esc(a.adoption_code)}','${PC.esc(a.applicant_name)}')">Reject</button>` : ''}
        </div>
      </td>
    </tr>`).join('');
}

async function viewApplication(code) {
  try {
    const data = await adminFetch(`/admin/get-applications.php?code=${encodeURIComponent(code)}`);
    const a = data.application;
    showAdminModal('Application Details', `
      <div style="font-size:13px;line-height:1.7;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          ${infoRow('Adoption Code', a.adoption_code)}
          ${infoRow('Status', `<span class="pc-badge pc-badge--${(a.status||'').toLowerCase()}">${a.status}</span>`)}
          ${infoRow('Applied', a.applied_at)}
          ${infoRow('Pet', `${a.pet_name} (${a.pet_id})`)}
          ${infoRow('Applicant', a.applicant_name)}
          ${infoRow('Email', a.applicant_email)}
          ${infoRow('Phone', a.applicant_phone)}
          ${infoRow('Address', `${a.address} ${a.apartment}, ${a.city}, ${a.state} ${a.zip}`)}
          ${infoRow('Employment', a.employment_status)}
          ${infoRow('Residence', a.residence_type)}
          ${infoRow('Landlord Allows Pets', a.landlord_allows)}
          ${infoRow('Has Vet', a.have_vet)}
          ${infoRow('Vet Name', a.vet_name)}
          ${infoRow('Can Afford Pet', a.can_afford)}
          ${infoRow('Pet Care Plan (inside)', a.inside_plan)}
          ${infoRow('Additional Info', a.additional_info)}
        </div>
        ${a.checkout_url ? `<p style="color:#0d7c4a;"><strong>Checkout URL:</strong> <a href="${PC.esc(a.checkout_url)}" target="_blank">${PC.esc(a.checkout_url)}</a></p>` : ''}
        ${a.rejection_notes ? `<p style="color:#c0392b;"><strong>Rejection Notes:</strong> ${PC.esc(a.rejection_notes)}</p>` : ''}
      </div>`, true);
  } catch (e) { PC.toast('Error loading application: ' + e.message, 'error'); }
}
function infoRow(label, val) {
  return val ? `<div style="background:#f9f7f4;border-radius:6px;padding:10px 12px;"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#7a6d5f;margin-bottom:3px;">${PC.esc(label)}</div><div style="color:#2c2416;">${val}</div></div>` : '';
}

function approveApp(code, applicant, petName) {
  showAdminModal('Approve Application', `
    <p style="color:#2c2416;margin-bottom:16px;">Approve <strong>${PC.esc(applicant)}</strong>'s application for <strong>${PC.esc(petName)}</strong>?</p>
    <div class="pc-form-group">
      <label class="pc-form-label">Paste Stripe Checkout Link *</label>
      <input class="pc-form-input" id="checkoutUrlInput" placeholder="https://checkout.petcenterco.com/PC-xxxxx-OD-xx" required>
      <p style="font-size:12px;color:#7a6d5f;margin-top:6px;">Generate this link from checkout.petcenterco.com and paste it here. It will be shown to the applicant on the status page.</p>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="pc-btn pc-btn--primary" onclick="confirmApprove('${PC.esc(code)}')">Approve &amp; Save Link</button>
      <button class="pc-btn pc-btn--ghost" onclick="PC.modal.closeAll()">Cancel</button>
    </div>`);
}

async function confirmApprove(code) {
  const url = document.getElementById('checkoutUrlInput')?.value?.trim();
  if (!url) { PC.toast('Please paste the checkout URL.', 'error'); return; }

  try {
    const fd = new FormData();
    fd.append('code', code);
    fd.append('action', 'approve');
    fd.append('checkout_url', url);
    const res = await adminFetch('/admin/update-adoption.php', { method: 'POST', body: fd, headers: {} });
    if (res.success) {
      PC.toast('Application approved! Checkout link saved.');
      PC.modal.closeAll();
      loadApplicationsPanel();
      loadStats();
    } else PC.toast(res.error || 'Failed.', 'error');
  } catch (e) { PC.toast('Error: ' + e.message, 'error'); }
}

function rejectApp(code, applicant) {
  showAdminModal('Reject Application', `
    <p style="color:#2c2416;margin-bottom:16px;">Reject <strong>${PC.esc(applicant)}</strong>'s application?</p>
    <div class="pc-form-group">
      <label class="pc-form-label">Rejection Reason (shown to applicant)</label>
      <textarea class="pc-form-textarea" id="rejectNotesInput" placeholder="e.g. Application incomplete, Pet already adopted, References not verified..."></textarea>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="pc-btn" style="background:#c0392b;color:#fff;" onclick="confirmReject('${PC.esc(code)}')">Send Rejection</button>
      <button class="pc-btn pc-btn--ghost" onclick="PC.modal.closeAll()">Cancel</button>
    </div>`);
}

async function confirmReject(code) {
  const notes = document.getElementById('rejectNotesInput')?.value?.trim() || '';
  try {
    const fd = new FormData();
    fd.append('code', code);
    fd.append('action', 'reject');
    fd.append('rejection_notes', notes);
    const res = await adminFetch('/admin/update-adoption.php', { method: 'POST', body: fd, headers: {} });
    if (res.success) {
      PC.toast('Application rejected.');
      PC.modal.closeAll();
      loadApplicationsPanel();
      loadStats();
    } else PC.toast(res.error || 'Failed.', 'error');
  } catch (e) { PC.toast('Error: ' + e.message, 'error'); }
}

// ─── Admin modal helper ────────────────────────────────────────────────────────
function showAdminModal(title, html, wide = false) {
  const overlay = document.getElementById('adminModal');
  const titleEl = document.getElementById('adminModalTitle');
  const bodyEl = document.getElementById('adminModalBody');
  if (!overlay || !bodyEl) return;
  overlay.querySelector('.pc-modal').className = `pc-modal ${wide ? 'pc-modal--wide' : ''}`;
  if (titleEl) titleEl.textContent = title;
  bodyEl.innerHTML = html;
  PC.modal.open('adminModal');
}

// ─── Admin fetch helper ────────────────────────────────────────────────────────
async function adminFetch(url, opts = {}) {
  const headers = { 'X-Admin-Token': adminToken, ...opts.headers };
  if (!(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...opts, headers });
  const data = await res.json();
  if (!res.ok && !data.success) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkExistingAuth();

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => { e.preventDefault(); adminLogin(); });
  }

  // Sidebar navigation
  document.querySelectorAll('.admin-nav__item[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
  });

  // Publish category selection
  document.querySelectorAll('[data-publish-cat]').forEach(btn => {
    btn.addEventListener('click', () => selectPublishCategory(btn.dataset.publishCat));
  });

  // Add pet form button
  const addPetBtn = document.getElementById('addPetBtn');
  if (addPetBtn) addPetBtn.addEventListener('click', addPetForm);

  // Publish all button
  const publishAllBtn = document.getElementById('publishAllBtn');
  if (publishAllBtn) publishAllBtn.addEventListener('click', publishAll);

  // Edit category change
  const editCatSel = document.getElementById('editCategorySel');
  if (editCatSel) editCatSel.addEventListener('change', () => loadEditCategoryPets(editCatSel.value));

  // Application filters
  ['appStatusFilter','appCatFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => renderApplicationsTable(allApplications));
  });

  // Admin modal close
  const modalClose = document.getElementById('adminModalClose');
  if (modalClose) modalClose.addEventListener('click', PC.modal.closeAll);

  // Mobile sidebar toggle
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggle && sidebar) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);
});
