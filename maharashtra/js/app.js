/**
 * Maharashtra Stamp Duty Calculator - Main Application Entrypoint
 * Bootstraps lifecycle hooks, wires event listeners, and initializes UI widgets.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const curLang = window.MH_UI ? window.MH_UI.getCurrentLang() : 'en';
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[curLang] : {};

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
      window.initSidebarListeners('Maharashtra', '919999999999');
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

    console.log('[StampDutyCalc.in] Maharashtra Calculator modular components successfully initialized.');
  });
})();
