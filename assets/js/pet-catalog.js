/* ═══════════════════════════════════════════════════════════════════════════
   Pet Center — pet-catalog.js
   Dynamic pet grid: AJAX loading, filtering, sorting, breed filter
   Used on: dogs.html, cats.html, birds.html, reptiles.html, small-mammals.html
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

(function () {
  const CATEGORY = document.getElementById('petCatalog')?.dataset?.category;
  if (!CATEGORY) return;

  let allPets = [];
  const gridEl = document.getElementById('petGrid');
  const breedFilter = document.getElementById('filterBreed');
  const feeFilter = document.getElementById('filterFee');
  const sizeFilter = document.getElementById('filterSize');
  const ageFilter = document.getElementById('filterAge');
  const sortSel = document.getElementById('sortBy');
  const countEl = document.getElementById('petCount');

  // ── Load all pets via AJAX ──────────────────────────────────────────────────
  async function loadPets() {
    showSkeletons();
    try {
      const data = await fetch(`/api/get-pets.php?category=${encodeURIComponent(CATEGORY)}`).then(r => r.json());
      allPets = (data.pets || []);
      populateBreedFilter();
      renderGrid();
    } catch (e) {
      gridEl.innerHTML = `<div class="pc-empty-state"><h3>No pets right now. Check back soon!</h3></div>`;
    }
  }

  // ── Show loading skeletons ──────────────────────────────────────────────────
  function showSkeletons() {
    gridEl.innerHTML = Array(8).fill('<div class="pc-skeleton"></div>').join('');
  }

  // ── Populate dynamic breed filter ───────────────────────────────────────────
  function populateBreedFilter() {
    if (!breedFilter) return;
    const breeds = [...new Set(allPets.map(p => p.breed).filter(Boolean))].sort();
    breedFilter.innerHTML = '<option value="">All Breeds</option>';
    breeds.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      breedFilter.appendChild(opt);
    });
  }

  // ── Apply filters & sort, then render ──────────────────────────────────────
  function applyAndRender() {
    const breed = breedFilter?.value || '';
    const fee = feeFilter?.value || '';
    const size = sizeFilter?.value || '';
    const age = ageFilter?.value || '';
    const sort = sortSel?.value || 'name';

    let filtered = allPets.filter(p => {
      if (breed && p.breed !== breed) return false;
      if (size && p.size?.toLowerCase() !== size.toLowerCase()) return false;

      if (fee) {
        const f = parseFloat(p.adoption_fee) || 0;
        if (fee === '0-100' && !(f >= 0 && f <= 100)) return false;
        if (fee === '100-500' && !(f > 100 && f <= 500)) return false;
        if (fee === '500-1000' && !(f > 500 && f <= 1000)) return false;
        if (fee === '1000+' && f <= 1000) return false;
      }

      if (age) {
        const a = parseFloat(p.age_years) || 0;
        if (age === '0-1' && !(a >= 0 && a < 1)) return false;
        if (age === '1-3' && !(a >= 1 && a < 3)) return false;
        if (age === '3-6' && !(a >= 3 && a < 6)) return false;
        if (age === '6+' && a < 6) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sort === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'age') return (parseFloat(a.age_years) || 0) - (parseFloat(b.age_years) || 0);
      if (sort === 'fee_asc') return (parseFloat(a.adoption_fee) || 0) - (parseFloat(b.adoption_fee) || 0);
      if (sort === 'fee_desc') return (parseFloat(b.adoption_fee) || 0) - (parseFloat(a.adoption_fee) || 0);
      return 0;
    });

    renderGrid(filtered);
  }

  // ── Render pet grid ─────────────────────────────────────────────────────────
  function renderGrid(pets = allPets) {
    if (countEl) countEl.textContent = pets.length;

    if (!pets.length) {
      const msg = allPets.length === 0
        ? `No adoptable ${CATEGORY} right now. Check back soon!`
        : `No ${CATEGORY} match your filters. Try adjusting your search.`;
      gridEl.innerHTML = `
        <div class="pc-empty-state">
          <div class="pc-empty-state__icon">${PC.icons.paw}</div>
          <h3>${PC.esc(msg)}</h3>
          <p>We add new pets regularly. Check back soon or browse other categories.</p>
        </div>`;
      return;
    }

    gridEl.innerHTML = pets.map((p, i) => petCard(p, i)).join('');

    // Add click handlers to navigate to pet detail
    gridEl.querySelectorAll('[data-pet-id]').forEach(card => {
      card.addEventListener('click', () => {
        const petId = card.dataset.petId;
        const cat = card.dataset.category;
        window.location.href = `/pet-detail.html?pet_id=${encodeURIComponent(petId)}&category=${encodeURIComponent(cat)}`;
      });
    });
  }

  // ── Build single pet card HTML ───────────────────────────────────────────────
  function petCard(p, i) {
    const adopted = p.status === 'Adopted';
    const img = p.single_image_url || '/assets/images/pet-placeholder.jpg';
    return `
      <div class="pc-pet-card slide-up stagger-${(i % 4) + 1}" data-pet-id="${PC.esc(p.pet_id)}" data-category="${PC.esc(p.category)}">
        <div class="pc-pet-card__img-wrap">
          <img class="pc-pet-card__img" src="${PC.esc(img)}" alt="${PC.esc(p.name)}" loading="lazy"
            onerror="this.src='/assets/images/pet-placeholder.jpg'">
          ${adopted ? '<span class="pc-pet-card__adopted-badge">Adopted</span>' : ''}
        </div>
        <div class="pc-pet-card__body">
          <div class="pc-pet-card__name">${PC.esc(p.name)}</div>
          <div class="pc-pet-card__breed">${PC.esc(p.breed || '')}${p.species ? ' &middot; ' + PC.esc(p.species) : ''}</div>
          <div class="pc-pet-card__meta">
            ${p.size ? `<span class="pc-pet-card__tag">${PC.esc(p.size)}</span>` : ''}
            ${p.age_years ? `<span class="pc-pet-card__tag">${PC.esc(PC.age(p.age_years))}</span>` : ''}
          </div>
          <div class="pc-pet-card__fee">${PC.fmt(p.adoption_fee)}</div>
        </div>
      </div>`;
  }

  // ── Attach filter & sort listeners ─────────────────────────────────────────
  [breedFilter, feeFilter, sizeFilter, ageFilter, sortSel].forEach(el => {
    if (el) el.addEventListener('change', applyAndRender);
  });

  // ── Init ────────────────────────────────────────────────────────────────────
  loadPets();
})();
