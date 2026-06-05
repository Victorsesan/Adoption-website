/* ═══════════════════════════════════════════════════════════════════════════
   Pet Center — status.js
   Adoption status checker — AJAX, no page reload
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

(function () {
  const form = document.getElementById('statusForm');
  const input = document.getElementById('statusCode');
  const resultArea = document.getElementById('statusResult');
  if (!form || !input || !resultArea) return;

  const btn = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const code = input.value.trim().toUpperCase();
    if (!code) { showError('Please enter your adoption code.'); return; }
    if (!/^AD-\d{5}-\d{4}$/.test(code)) {
      showError('Invalid code format. Example: AD-47293-2026');
      return;
    }

    setLoading(true);
    resultArea.style.display = 'none';

    try {
      const data = await fetch(`/api/adoption/${code}`).then(r => r.json());
      if (!data.success) {
        showError(data.error || 'Code not found. Please check and try again.');
        return;
      }
      showResult(data);
    } catch {
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(on) {
    if (btn) {
      btn.disabled = on;
      btn.innerHTML = on
        ? `<span class="pc-spinner"></span> Checking...`
        : `Check Status`;
    }
  }

  function showError(msg) {
    resultArea.style.display = 'block';
    resultArea.innerHTML = `
      <div class="pc-status-result--error">
        <div class="pc-status-result__title">Code Not Found</div>
        <p style="color:rgba(255,255,255,0.8);margin-top:8px;font-size:14px;">${PC.esc(msg)}</p>
      </div>`;
  }

  function showResult(data) {
    resultArea.style.display = 'block';

    if (data.status === 'PENDING') {
      resultArea.innerHTML = `
        <div class="pc-status-result--pending fade-in">
          <div class="pc-status-result__title" style="color:#fff;">${PC.esc(data.applicant_name)}'s Application</div>
          <p style="color:rgba(255,255,255,0.8);margin-top:8px;font-size:14px;">
            Pet: <strong style="color:#fff;">${PC.esc(data.pet_name)}</strong>
          </p>
          <p style="color:rgba(255,255,255,0.75);margin-top:6px;font-size:14px;display:flex;align-items:center;gap:8px;">
            <span style="display:inline-flex;width:18px;height:18px;color:#d7bd88;">${PC.icons.clock}</span>
            Your application is under review. Check back in 1-2 hours.
          </p>
        </div>`;
      return;
    }

    if (data.status === 'APPROVED') {
      resultArea.innerHTML = `
        <div class="pc-status-result--approved slide-up">
          <div class="pc-celebrate-anim">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d7c4a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="pc-status-result__title">Congratulations, ${PC.esc(data.applicant_name)}!</div>
          <p style="color:#0d7c4a;font-size:14px;margin-top:6px;font-weight:600;">Your adoption application has been approved!</p>
          ${data.pet_image_url ? `<img src="${PC.esc(data.pet_image_url)}" alt="${PC.esc(data.pet_name)}" style="width:100px;height:100px;object-fit:cover;border-radius:12px;margin:16px 0;box-shadow:0 4px 14px rgba(0,0,0,0.12);">` : ''}
          <p style="color:#2c2416;font-size:14px;margin-bottom:16px;"><strong>Pet:</strong> ${PC.esc(data.pet_name)}</p>

          <div class="pc-payment-box">
            <h4>You are eligible for the following flexible payment options during checkout:</h4>
            <div class="pc-payment-option">
              <div class="pc-payment-icon">${PC.icons.card}</div>
              <div>
                <div class="pc-payment-option__title">BNPL — Buy Now, Pay Later</div>
                <div class="pc-payment-option__desc">Select "Apply for BNPL" during card checkout. It only takes about 2-5 minutes to apply and is reviewed within 24 hours. Once approved, your pet is usually shipped or delivered locally the same day.</div>
              </div>
            </div>
            <div class="pc-payment-option">
              <div class="pc-payment-icon">${PC.icons.truck}</div>
              <div>
                <div class="pc-payment-option__title">Pay on Delivery</div>
                <div class="pc-payment-option__desc">Adopt your pet and pay only when you receive them at home. For non-local adoptions, you pay on delivery; for local adoptions, payment is made upon pickup or delivery.</div>
              </div>
            </div>
            <div class="pc-payment-option">
              <div class="pc-payment-icon">${PC.icons.calendar}</div>
              <div>
                <div class="pc-payment-option__title">Installment Plans — Pay in 4</div>
                <div class="pc-payment-option__desc">Pay for your pet in 4 installment payments over the months using your PayPal account, or choose our in-house installment option for even more flexible terms. To set up Pay in 4 or in-house installments, please <a href="https://docs.petcenterco.com/contact-us" target="_blank" style="color:#ED7624;">contact our customer support team</a> — they will help you configure the plan that works best for you.</div>
              </div>
            </div>
          </div>
          ${data.checkout_url ? `
            <a href="${PC.esc(data.checkout_url)}" class="pc-btn pc-btn--orange pc-btn--lg" style="margin-top:20px;width:100%;justify-content:center;" target="_blank">
              Proceed to Checkout ${PC.icons.arrow}
            </a>` : ''}
        </div>`;
      return;
    }

    if (data.status === 'REJECTED') {
      resultArea.innerHTML = `
        <div class="pc-status-result--rejected fade-in">
          <div class="pc-status-result__title">Application Not Approved</div>
          <p style="color:#c0392b;margin-top:8px;font-size:14px;font-weight:600;">Your application for <strong>${PC.esc(data.pet_name)}</strong> was not approved.</p>
          ${data.rejection_notes ? `
            <div style="background:#fff;border-radius:8px;padding:16px;margin-top:16px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#7a6d5f;margin-bottom:6px;">Reason</div>
              <p style="color:#2c2416;font-size:14px;">${PC.esc(data.rejection_notes)}</p>
            </div>` : ''}
          <p style="margin-top:16px;font-size:14px;color:#7a6d5f;">
            Please <a href="https://docs.petcenterco.com/contact-us" target="_blank" style="color:#ED7624;">contact us</a> for more information.
          </p>
        </div>`;
    }
  }
})();
