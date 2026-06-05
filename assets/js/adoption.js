/* ═══════════════════════════════════════════════════════════════════════════
   Pet Center — adoption.js
   Adoption application form enhancements:
   - Pet pre-fill from ?pet_id URL param
   - Signature pad
   - File uploads with pre-upload
   - Form submission → API → success modal with adoption code
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

(function () {
  if (!document.getElementById('adoptionForm')) return;

  // ── Pre-fill pet data from URL param ──────────────────────────────────────
  const petId = PC.param('pet_id');
  const category = PC.param('category');

  if (petId && category) {
    loadPetData(petId, category);
  }

  async function loadPetData(petId, category) {
    try {
      const data = await fetch(`/admin/get-pets.php?category=${encodeURIComponent(category)}&pet_id=${encodeURIComponent(petId)}`).then(r => r.json());
      if (!data.success || !data.pet) return;
      preFillPet(data.pet);
    } catch (e) {
      console.warn('Could not pre-fill pet data:', e);
    }
  }

  function preFillPet(pet) {
    const prefillBox = document.getElementById('petPrefill');
    if (prefillBox) {
      prefillBox.classList.add('show');
      const img = document.getElementById('prefillImg');
      const name = document.getElementById('prefillName');
      const meta = document.getElementById('prefillMeta');
      const fee = document.getElementById('prefillFee');
      if (img) { img.src = pet.single_image_url || '/assets/images/pet-placeholder.jpg'; img.alt = pet.name; }
      if (name) name.textContent = pet.name;
      if (meta) meta.textContent = `${pet.species || ''} · ${pet.breed || ''} · ${pet.size || ''} · ${PC.age(pet.age_years)}`;
      if (fee) fee.textContent = PC.fmt(pet.adoption_fee) + ' adoption fee';
    }

    // Fill hidden fields
    const setHidden = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setHidden('hidden_pet_id', pet.pet_id);
    setHidden('hidden_pet_name', pet.name);
    setHidden('hidden_pet_image_url', pet.single_image_url);
    setHidden('hidden_pet_category', pet.category);
    setHidden('hidden_pet_breed', pet.breed);
    setHidden('hidden_pet_age', pet.age_years);
    setHidden('hidden_pet_size', pet.size);
    setHidden('hidden_adoption_fee', pet.adoption_fee);

    // Pre-fill read-only displayed fields
    const wantAdopt = document.querySelector('[name="want_adopt"]');
    if (wantAdopt && !wantAdopt.value) wantAdopt.value = `${pet.species || pet.category} — ${pet.name}`;
  }

  // ── Form submission ────────────────────────────────────────────────────────
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('adoptionForm');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const agree = document.getElementById('finalAgree');
      if (agree && !agree.checked) {
        PC.toast('Please confirm the information is correct and agree to the terms.', 'error');
        return;
      }

      // Basic required field validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(el => {
        if (!el.value.trim()) {
          el.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.35)';
          valid = false;
        } else {
          el.style.boxShadow = '';
        }
      });
      if (!valid) {
        PC.toast('Please fill in all required fields.', 'error');
        form.querySelector('[required]:invalid, [required]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      submitBtn.disabled = true;
      const btnText = document.getElementById('btnText');
      if (btnText) btnText.innerHTML = `<span class="pc-spinner"></span> Submitting...`;

      try {
        const formData = new FormData(form);

        // Add signature data
        const canvas = document.getElementById('sigCanvas');
        if (canvas) formData.append('signature_data', canvas.toDataURL('image/png'));

        // Add pre-uploaded file tokens from file upload fields
        ['file_id', 'file_address', 'file_vet'].forEach(key => {
          const field = window.pcUploadFields?.[key];
          if (field?.arr) {
            field.arr.forEach(item => {
              if (item.file) formData.append(key, item.file, item.name);
            });
          }
        });

        const res = await fetch('/api/submit-adoption.php', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          showSuccessModal(data.adoption_code);
        } else {
          PC.toast(data.error || 'Submission failed. Please try again.', 'error');
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Submit Application';
        }
      } catch (e) {
        PC.toast('Network error. Please try again.', 'error');
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Submit Application';
      }
    });
  }

  function showSuccessModal(code) {
    const overlay = document.getElementById('successModal');
    const codeEl = document.getElementById('successCode');
    if (overlay) {
      if (codeEl) codeEl.textContent = code;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Copy button
    const copyBtn = document.getElementById('copyCode');
    if (copyBtn) copyBtn.addEventListener('click', () => PC.copy(code));

    // Check status button
    const statusBtn = document.getElementById('checkStatusBtn');
    if (statusBtn) {
      statusBtn.addEventListener('click', () => {
        window.location.href = `/?code=${encodeURIComponent(code)}`;
      });
    }
  }
})();
