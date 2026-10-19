/**
 * West Bengal Stamp Duty Calculator - Main Application Entrypoint
 * Bootstraps lifecycle hooks, wires event listeners, and initializes UI widgets.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const curLang = window.WB_UI ? window.WB_UI.getCurrentLang() : 'en';
    const i18n = (window.WB_I18N_MODULE && window.WB_I18N_MODULE.WB_I18N) ? window.WB_I18N_MODULE.WB_I18N.T : {};
    const t = i18n[curLang] || {};

    // 1. Initialize mobile floating calculate button
    if (typeof window.initFloatingBtn === 'function') {
      window.initFloatingBtn({
        text: t.floatCalcBtn || '⚡ Calculate',
        mainBtnId: 'calcBtn',
        inputId: 'propertyValue',
        onCalcTrigger: window.calculate
      });
    }

    // 2. Initialize WhatsApp Lead Capture Sidebar
    if (typeof window.initSidebarListeners === 'function') {
      window.initSidebarListeners('West Bengal', '919752623983');
    }

    // 3. Setup property value enter key listener
    const propInput = document.getElementById('propertyValue');
    if (propInput) {
      propInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.calculate();
        }
      });
    }

    // 4. Clear input error highlight on type
    ['sbName', 'sbPhone', 'sbLocality'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        el.classList.remove('has-error');
        const err = document.getElementById(id + 'Err');
        if (err) err.classList.remove('visible');
      });
    });

    console.log('[StampDutyCalc.in] West Bengal Calculator modular components successfully initialized.');
  });
})();
