/* ═══════════════════════════════════════════════════════════════════════════
   Pet Center Adoption Website — app.js
   Core utilities, navigation, and shared functions
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ─── Global utilities ────────────────────────────────────────────────────────
const PC = window.PC = {
  // Escape HTML to prevent XSS
  esc: s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),

  // Format currency
  fmt: n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),

  // Format age
  age: n => {
    n = parseFloat(n);
    if (!n) return 'Unknown';
    return n < 1 ? `${Math.round(n * 12)} months` : n === 1 ? '1 year' : `${n} years`;
  },

  // Debounce
  debounce: (fn, ms = 300) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  // Show toast notification
  toast: (msg, type = 'success') => {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;background:${type === 'success' ? '#0d7c4a' : '#c0392b'};color:#fff;padding:14px 20px;border-radius:10px;font-family:Sora,sans-serif;font-size:14px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:slideUp 0.3s ease;max-width:340px;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3500);
  },

  // Copy to clipboard
  copy: async text => {
    try {
      await navigator.clipboard.writeText(text);
      PC.toast('Copied to clipboard!');
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
      PC.toast('Copied!');
    }
  },

  // URL parameter helper
  param: key => new URLSearchParams(location.search).get(key),

  // Fetch with error handling
  api: async (url, opts = {}) => {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts
    });
    const data = await res.json();
    if (!res.ok && !data.success) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  // Get URL param
  param: key => new URLSearchParams(window.location.search).get(key),
};

// ─── SVG Icons (used throughout — no emojis) ──────────────────────────────────
PC.icons = {
  paw: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.5 5C6.4 5 5.5 5.9 5.5 7s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 4c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  pets: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
};

// ─── Modal management ─────────────────────────────────────────────────────────
PC.modal = {
  open: id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
  },
  close: id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
  },
  closeAll: () => {
    document.querySelectorAll('.pc-modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('pc-modal-overlay')) PC.modal.closeAll();
});

// Close modals on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') PC.modal.closeAll();
});

// ─── Navigation menu enhancement ─────────────────────────────────────────────
(function initNav() {
  // Update nav links based on spec
  const aboutLinks = document.querySelectorAll('a[href="about.html"], a[href="./about.html"]');
  aboutLinks.forEach(a => { a.href = 'https://docs.petcenterco.com/adoption-policy'; a.target = '_blank'; });

  const contactLinks = document.querySelectorAll('a[href="contact.html"], a[href="./contact.html"]');
  contactLinks.forEach(a => { a.href = 'https://docs.petcenterco.com/contact-us'; a.target = '_blank'; });
})();

// ─── Stagger animate on scroll ─────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.observe-me').forEach(el => observer.observe(el));

/* ─── Custom Select Dropdown Init ───────────────────────────────────────────── */
(function () {
  function initCustomSelects(root) {
    var wrappers = (root || document).querySelectorAll('.custom-select-wrapper');
    wrappers.forEach(function (wrapper) {
      if (wrapper.dataset.csInit) return;
      wrapper.dataset.csInit = '1';

      var select  = wrapper.querySelector('.hidden-select');
      var trigger = wrapper.querySelector('.custom-select-trigger');
      var options = wrapper.querySelector('.custom-select-options');
      if (!select || !trigger || !options) return;

      function setSelected(val, label) {
        var valueEl = trigger.querySelector('.custom-select-value');
        if (valueEl) valueEl.textContent = label;
        options.querySelectorAll('li').forEach(function (li) {
          li.classList.toggle('selected', li.dataset.value === val);
        });
        select.value = val;
      }

      // Sync initial selected state
      var initOpt = options.querySelector('li[data-value="' + select.value + '"]') || options.querySelector('li');
      if (initOpt) setSelected(initOpt.dataset.value, initOpt.textContent);

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = options.classList.contains('open');
        // Close all other dropdowns
        document.querySelectorAll('.custom-select-options.open').forEach(function (o) {
          o.classList.remove('open');
          o.closest('.custom-select-wrapper')?.querySelector('.custom-select-trigger')?.classList.remove('active');
        });
        if (!open) {
          options.classList.add('open');
          trigger.classList.add('active');
        }
      });

      options.querySelectorAll('li').forEach(function (li) {
        li.addEventListener('click', function (e) {
          e.stopPropagation();
          setSelected(li.dataset.value, li.textContent);
          options.classList.remove('open');
          trigger.classList.remove('active');
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    });
  }

  document.addEventListener('click', function () {
    document.querySelectorAll('.custom-select-options.open').forEach(function (o) {
      o.classList.remove('open');
      o.closest('.custom-select-wrapper')?.querySelector('.custom-select-trigger')?.classList.remove('active');
    });
  });

  document.addEventListener('DOMContentLoaded', function () { initCustomSelects(); });
  window.initCustomSelects = initCustomSelects;
})();
