/**
 * ==============================================================================
 * StampDutyCalc.in — Shared Application Utilities
 * Modular UI widgets, currency formatters, clipboard/sharing, and lead capture.
 * ==============================================================================
 */

/**
 * DOM element retrieval shortcut
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function g(id) {
  return document.getElementById(id);
}

/**
 * Toggles a class on an element
 * @param {string} id - Element ID
 * @param {string} className - Class name
 * @param {boolean} [force] - Optional force state
 */
function toggleClass(id, className, force) {
  const el = g(id);
  if (!el) return;
  if (typeof force === 'boolean') {
    el.classList.toggle(className, force);
  } else {
    el.classList.toggle(className);
  }
}

/**
 * Accordion toggle handler with single-item open behavior
 * @param {HTMLElement} btn - The accordion button clicked
 */
function toggleAccordion(btn) {
  if (!btn) return;
  const content = btn.nextElementSibling;
  if (!content) return;

  const isOpen = content.classList.contains('open');

  // Close other open accordions in the same container
  document.querySelectorAll('.accordion-content.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.accordion-btn.open').forEach(el => el.classList.remove('open'));

  if (!isOpen) {
    content.classList.add('open');
    btn.classList.add('open');
  }
}

/**
 * Opens a modal dialog with accessible focus management
 * @param {string} id - Modal element ID
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const firstFocus = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocus) firstFocus.focus();
}

/**
 * Closes an open modal dialog
 * @param {string} id - Modal element ID
 */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Global escape key listener to dismiss open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

/**
 * Dynamically updates verified date stamps on the page
 */
(function setVerifiedDate() {
  const now = new Date();
  const day = now.getDate();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatted = `${day} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const el = document.getElementById('verifiedDate');
  if (el) el.textContent = formatted;

  const ds = document.getElementById('disclaimerDateSpan');
  if (ds) ds.textContent = `(as of ${formatted})`;
})();

/**
 * Formats a numeric value into standard Indian Rupee notation (₹ xx,xx,xxx)
 * @param {number} n - Amount
 * @returns {string} Formatted INR string
 */
function fmt(n) {
  if (isNaN(n) || n === null || n === undefined) return '₹0';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

/**
 * Converts numbers into localized Indian denominations (Crore, Lakh, Thousand)
 * @param {number} n - Amount
 * @param {Object} labels - Localized strings { crore, lakh, thousand }
 * @returns {string} Words representation
 */
function numToWords(n, labels) {
  if (!n || isNaN(n) || n <= 0) return '';
  const lbl = labels || { crore: 'Crore', lakh: 'Lakh', thousand: 'Thousand' };

  if (n >= 1e7) {
    const v = n / 1e7;
    return (Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, '')) + ' ' + lbl.crore;
  }
  if (n >= 1e5) {
    const v = n / 1e5;
    return (Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, '')) + ' ' + lbl.lakh;
  }
  if (n >= 1000) {
    const v = n / 1000;
    return (Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, '')) + ' ' + lbl.thousand;
  }
  return n.toLocaleString('en-IN');
}

/**
 * Initializes floating calculate button with IntersectionObserver
 * @param {Object} config
 * @param {string} config.text - Button HTML label
 * @param {string} config.mainBtnId - Main calculate button ID
 * @param {string} config.inputId - Main property input ID
 * @param {Function} config.onCalcTrigger - Callback function on click
 */
function initFloatingBtn(config) {
  const floatBtn = document.createElement('button');
  floatBtn.id = 'floatCalcBtn';
  floatBtn.className = 'float-calc-btn';
  floatBtn.type = 'button';
  floatBtn.innerHTML = config.text || '⚡ Calculate';
  floatBtn.onclick = config.onCalcTrigger;
  document.body.appendChild(floatBtn);

  const calcBtn = document.getElementById(config.mainBtnId);
  const propInput = document.getElementById(config.inputId);
  let mainBtnVisible = true;

  if (calcBtn && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      mainBtnVisible = entries[0].isIntersecting;
      window.updateFloatBtnState();
    }, { threshold: 0.5 });
    observer.observe(calcBtn);
  }

  window.updateFloatBtnState = function () {
    if (!propInput) return;
    const val = parseFloat(propInput.value);
    const hasValue = propInput.value.trim() !== '' && !isNaN(val) && val > 0;
    const shouldShow = !mainBtnVisible && hasValue;

    if (shouldShow && !floatBtn.classList.contains('visible')) {
      floatBtn.classList.add('visible');
    } else if (!shouldShow) {
      floatBtn.classList.remove('visible');
    }
  };

  if (propInput) {
    propInput.addEventListener('input', window.updateFloatBtnState);
  }
}

/**
 * Copies text to clipboard and shows transient visual confirmation
 * @param {string} text - Content to copy
 * @param {string} btnId - Copy button element ID
 * @param {string} copiedLabel - Success label
 * @param {string} failMessage - Failure fallback message
 */
function executeCopy(text, btnId, copiedLabel, failMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      const originalText = btn.textContent;
      btn.classList.add('copied');
      btn.textContent = copiedLabel || '✓ Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = originalText;
      }, 2200);
    }).catch(() => {
      alert(failMessage || 'Copy not supported. Please select and copy manually.');
    });
  } else {
    alert(failMessage || 'Copy not supported. Please select and copy manually.');
  }
}

/**
 * Invokes native Web Share API with WhatsApp web fallback
 * @param {Object} sharePayload - { title, text, url }
 * @param {string} fallbackUrl - Fallback URL string
 */
function executeShare(sharePayload, fallbackUrl) {
  if (navigator.share) {
    navigator.share(sharePayload).catch(() => {});
  } else {
    const textParam = encodeURIComponent((sharePayload.text || '') + '\n' + (fallbackUrl || window.location.href));
    window.open(`https://wa.me/?text=${textParam}`, '_blank');
  }
}

/**
 * Initializes WhatsApp lead capture sidebar form listeners and submission
 * @param {string} stateName - Jurisdiction name
 * @param {string} waNumber - WhatsApp destination number
 */
function initSidebarListeners(stateName, waNumber) {
  ['sbName', 'sbPhone', 'sbLocality'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.classList.remove('has-error');
      const errEl = document.getElementById(id + 'Err');
      if (errEl) errEl.classList.remove('visible');
    });
  });

  window.submitSidebar = function () {
    const nameInput = document.getElementById('sbName');
    const phoneInput = document.getElementById('sbPhone');
    const localityInput = document.getElementById('sbLocality');
    if (!nameInput || !phoneInput || !localityInput) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim().replace(/\s/g, '');
    const locality = localityInput.value;

    let isValid = true;
    const setErr = (id, errId, show) => {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (el) el.classList.toggle('has-error', show);
      if (err) err.classList.toggle('visible', show);
      if (show) isValid = false;
    };

    setErr('sbName', 'sbNameErr', name.length < 2);
    setErr('sbPhone', 'sbPhoneErr', !/^[6-9][0-9]{9}$/.test(phone));
    setErr('sbLocality', 'sbLocalityErr', locality === '');

    if (!isValid) return;

    const btn = document.getElementById('sbSubmit');
    if (btn) btn.classList.add('loading');

    const msg = encodeURIComponent(
      `Hi, I used StampDutyCalc.in and would like the FREE ${stateName} Property Registration Checklist (PDF).\n\n` +
      `Name: ${name}\n` +
      `Area/Locality: ${locality}\n` +
      `WhatsApp: +91${phone}\n\n` +
      `Please send the checklist. Thank you!`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
      if (btn) btn.classList.remove('loading');
      const formWrap = document.getElementById('sbFormWrap');
      const successBox = document.getElementById('sbSuccess');
      if (formWrap) formWrap.style.display = 'none';
      if (successBox) successBox.classList.add('visible');
    }, 800);
  };
}
