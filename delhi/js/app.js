/**
 * Delhi (NCT) Stamp Duty Calculator - Main Entrypoint
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize mobile floating calculate button
    if (typeof window.initFloatingBtn === 'function') {
      window.initFloatingBtn({
        text: '⚡ Calculate',
        mainBtnId: 'calcBtn',
        inputId: 'agreementValue',
        onCalcTrigger: window.calculate
      });
    }

    // 2. Initialize WhatsApp Lead Capture Sidebar for Delhi
    if (typeof window.initSidebarListeners === 'function') {
      window.initSidebarListeners('Delhi NCR', '919752623983');
    }

    // 3. Input listeners for live words conversion and enter trigger
    ['agreementValue', 'circleRateValue'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        if (window.DELHI_UI) window.DELHI_UI.updateNumWords();
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.calculate();
        }
      });
    });

    ['deedType', 'municipalArea'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          if (document.getElementById('calcResults') && document.getElementById('calcResults').style.display !== 'none') {
            window.calculate();
          }
        });
      }
    });
  });
})();
