/**
 * Maharashtra Stamp Duty Calculator - UI Controller
 * Manages UI state, DOM updates, language switching, event actions, and result rendering.
 */

(function (window) {
  'use strict';

  // Helper fallbacks to ensure safety
  const g = (id) => (typeof window.g === 'function' ? window.g(id) : document.getElementById(id));
  const fmt = (n) => (typeof window.fmt === 'function' ? window.fmt(n) : '₹' + Math.round(n).toLocaleString('en-IN'));

  // State Management
  let currentLang   = 'en';
  let currentZone   = 'urban';
  let currentGender = 'male';

  /**
   * Switches the active language (English / Marathi)
   * @param {string} lang - 'en' or 'mr'
   */
  function switchLang(lang) {
    currentLang = lang;
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[lang] : null;
    if (!t) return;

    const htmlRoot = g('html-root');
    if (htmlRoot) htmlRoot.lang = lang === 'mr' ? 'mr' : 'en';

    document.body.classList.toggle('lang-mr', lang === 'mr');

    const btnEn = g('lang-en');
    const btnMr = g('lang-mr');
    if (btnEn) {
      btnEn.classList.toggle('active', lang === 'en');
      btnEn.setAttribute('aria-pressed', lang === 'en');
    }
    if (btnMr) {
      btnMr.classList.toggle('active', lang === 'mr');
      btnMr.setAttribute('aria-pressed', lang === 'mr');
    }

    if (i18n.TEXT_IDS) {
      i18n.TEXT_IDS.forEach(id => {
        const el = g(id);
        if (el && t[id] !== undefined) el.textContent = t[id];
      });
    }

    if (i18n.HTML_IDS) {
      i18n.HTML_IDS.forEach(id => {
        const el = g(id);
        if (el && t[id] !== undefined) el.innerHTML = t[id];
      });
    }

    const propInput = g('propertyValue');
    if (propInput) {
      propInput.placeholder = lang === 'mr' ? 'उदा: 7500000' : 'e.g. 7500000';
    }

    const fb = g('floatCalcBtn');
    if (fb) fb.innerHTML = t.floatCalcBtn;

    updateNumWords();
    updateDeedNote();
  }

  /**
   * Returns current selected Area display label
   */
  function getAreaLabel() {
    const sel = g('areaSelect');
    if (!sel) return '—';
    return sel.options[sel.selectedIndex]?.text || '—';
  }

  /**
   * Area select change handler
   */
  function onAreaChange() {
    const sel  = g('areaSelect');
    if (!sel) return;
    const area = sel.value;
    const opt  = sel.options[sel.selectedIndex];
    const isOther = (area === 'other');

    if (isOther && opt && opt.dataset.zone) {
      setZone(opt.dataset.zone);
    }

    // Dynamic breadcrumb city segment
    const cityEl  = g('breadcrumbCity');
    const cityTxt = g('breadcrumbCityName');
    if (cityEl && cityTxt) {
      if (area && opt && opt.text && opt.text !== '— Select Area —') {
        cityTxt.textContent = opt.text;
        cityEl.style.display = 'flex';
      } else {
        cityEl.style.display = 'none';
      }
    }
    hideResults();
  }

  /**
   * Sets active property zone ('urban', 'mun_council', 'rural')
   */
  function setZone(z) {
    currentZone = z;
    ['urban', 'mun', 'rural'].forEach(k => {
      const btn = g('btn-zone-' + k);
      if (btn) btn.classList.remove('active');
    });

    const map = { urban: 'urban', mun_council: 'mun', rural: 'rural' };
    const targetBtn = g('btn-zone-' + map[z]);
    if (targetBtn) targetBtn.classList.add('active');

    hideResults();
  }

  /**
   * Sets active ownership / gender type ('male', 'female', 'joint')
   */
  function setGender(gen) {
    currentGender = gen;
    ['male', 'female', 'joint'].forEach(v => {
      const btn = g('btn-' + v);
      if (btn) btn.classList.toggle('active', v === gen);
    });

    // Display female sole-ownership rebate guidance
    const hasRebate = (gen === 'female' || gen === 'joint');
    const rebateNote = g('genderRebateNote');
    if (rebateNote) rebateNote.classList.toggle('visible', hasRebate);

    hideResults();
  }

  /**
   * Toggle Market Value / Ready Reckoner informational panel
   */
  function toggleMvInfo() {
    const mvToggle = g('mvToggle');
    const mvBox = g('mvInfoBox');
    if (mvToggle && mvBox) {
      mvBox.classList.toggle('visible', mvToggle.checked);
    }
  }

  /**
   * Hides the calculation results card
   */
  function hideResults() {
    const card = g('resultsCard');
    if (card) card.classList.remove('visible');
  }

  /**
   * Deed type change handler
   */
  function updateDeedNote() {
    const deedEl = g('deedType');
    const noteEl = g('deedNoteBox');
    if (!deedEl || !noteEl) return;

    const deed = deedEl.value;
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[currentLang] : null;
    const note = t && t.deedNote ? t.deedNote[deed] : null;

    if (note) {
      noteEl.textContent = note;
      noteEl.classList.add('visible');
    } else {
      noteEl.classList.remove('visible');
      noteEl.textContent = '';
    }
    hideResults();
  }

  /**
   * Converts numerical input to Lakhs/Crores description in real time
   */
  function updateNumWords() {
    const propInput = g('propertyValue');
    const el = g('numWords');
    if (!propInput || !el) return;

    const v = parseFloat(propInput.value);
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[currentLang] : null;
    if (!t) return;

    const labels = { crore: t.numCrore, lakh: t.numLakh, thousand: t.numThousand };
    const w = typeof window.numToWords === 'function' ? window.numToWords(v, labels) : '';

    if (w) {
      el.textContent = t.numPrefix + w;
      el.classList.remove('empty');
    } else {
      el.textContent = t.numWordsDefault;
      el.classList.add('empty');
    }

    if (typeof window.updateFloatBtnState === 'function') {
      window.updateFloatBtnState();
    }
  }

  /**
   * Clears value input validation errors
   */
  function clearError() {
    const field = g('field-value');
    const err = g('err-value');
    if (field) field.classList.remove('has-error');
    if (err) err.classList.remove('visible');
  }

  /**
   * Executes validation, calculation, and UI updates
   */
  function calculate() {
    const propInput = g('propertyValue');
    if (!propInput) return;

    const raw = propInput.value.trim();
    const val = parseFloat(raw);

    if (!raw || isNaN(val) || val <= 0) {
      const field = g('field-value');
      const err = g('err-value');
      if (field) field.classList.add('has-error');
      if (err) err.classList.add('visible');
      propInput.focus();
      return;
    }
    clearError();

    const area = g('areaSelect') ? g('areaSelect').value : '';
    const deed = g('deedType') ? g('deedType').value : 'sale';

    // Compute via core engine
    const res = window.MH_CALCULATOR.computeStampDuty({
      val,
      area,
      gender: currentGender,
      zone: currentZone,
      deed
    });

    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[currentLang] : {};
    const areaLabel = getAreaLabel() || area;

    // Toggle Metro and LBT rows
    const rowMetro = g('row-metro');
    const rowLbt   = g('row-lbt');
    if (rowMetro) rowMetro.style.display = res.showMR ? 'flex' : 'none';
    if (rowLbt)   rowLbt.style.display   = res.showLBT ? 'flex' : 'none';

    // Female sole-owner rebate row
    const rowRebate = g('row-gender-rebate');
    if (rowRebate) rowRebate.classList.toggle('visible', res.showRebateRow);
    const resGenderRebate = g('resGenderRebate');
    if (resGenderRebate && res.showRebateRow) {
      resGenderRebate.textContent = '−' + fmt(res.rebateAmt);
    }

    // Base Duty Row
    const resBaseBadge = g('resBaseRateBadge');
    const resBaseAmt   = g('resBaseAmt');
    if (res.isPOA) {
      if (resBaseBadge) resBaseBadge.textContent = '₹500';
      if (resBaseAmt)   resBaseAmt.textContent = fmt(500);
    } else if (res.isGiftR) {
      if (resBaseBadge) resBaseBadge.textContent = '2%';
      if (resBaseAmt)   resBaseAmt.textContent = fmt(res.rawDuty);
    } else {
      if (resBaseBadge) resBaseBadge.textContent = (res.rates.base * 100).toFixed(0) + '%';
      if (resBaseAmt)   resBaseAmt.textContent = fmt(res.baseDutyAmt);
    }

    // Metro & LBT amounts
    const resMetroAmt = g('resMetroAmt');
    const resLbtAmt   = g('resLbtAmt');
    if (resMetroAmt) resMetroAmt.textContent = fmt(res.metroAmt);
    if (resLbtAmt)   resLbtAmt.textContent   = fmt(res.lbtAmt);

    // Total duty badge
    const resEffBadge = g('resEffBadge');
    if (resEffBadge) {
      if (res.isPOA)        resEffBadge.textContent = '₹500';
      else if (res.isGiftR) resEffBadge.textContent = '2%';
      else                  resEffBadge.textContent = (res.effectiveRate * 100).toFixed(0) + '%';
    }

    const resTotalDuty    = g('resTotalDuty');
    const resRegBadge     = g('resRegBadge');
    const resRegFee       = g('resRegFee');
    const resTotalPayable = g('resTotalPayable');
    const resTotalDisplay = g('resTotalDisplay');
    const resSubLine      = g('resSubLine');

    if (resTotalDuty)    resTotalDuty.textContent = fmt(res.rawDuty);
    if (resRegBadge)     resRegBadge.textContent = res.regLabel;
    if (resRegFee)       resRegFee.textContent = fmt(res.reg);
    if (resTotalPayable) resTotalPayable.textContent = fmt(res.total);
    if (resTotalDisplay) resTotalDisplay.textContent = fmt(res.total);
    if (resSubLine && t.deedLabel) {
      resSubLine.textContent = (t.deedLabel[deed] || deed) + ' · ' + areaLabel;
    }

    // Semantic Context Box
    const seoBox = g('seoContextBox');
    if (seoBox) seoBox.style.display = 'block';
    const seoMetro = g('seoCtxMetroCess');
    if (seoMetro) {
      seoMetro.style.display = (res.isMMR && res.isStd) ? 'block' : 'none';
    }

    // Reveal and scroll to results card
    const card = g('resultsCard');
    if (card) {
      card.classList.add('visible');
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    // Save global state for Copy and Share
    window._R = {
      val,
      total: res.total,
      duty: res.rawDuty,
      reg: res.reg,
      areaLabel,
      deed,
      deedLbl: t.deedLabel ? t.deedLabel[deed] : deed
    };
  }

  /**
   * Resets all fields to pristine initial state
   */
  function resetCalc() {
    const propInput = g('propertyValue');
    if (propInput) propInput.value = '';

    const areaSelect = g('areaSelect');
    if (areaSelect) areaSelect.value = '';

    const deedType = g('deedType');
    if (deedType) deedType.value = 'sale';

    hideResults();
    setGender('male');

    const mvToggle = g('mvToggle');
    if (mvToggle) mvToggle.checked = false;

    const mvBox = g('mvInfoBox');
    if (mvBox) mvBox.classList.remove('visible');

    const deedNoteBox = g('deedNoteBox');
    if (deedNoteBox) deedNoteBox.classList.remove('visible');

    const seoBox = g('seoContextBox');
    if (seoBox) seoBox.style.display = 'none';

    const cityEl = g('breadcrumbCity');
    const cityTxt = g('breadcrumbCityName');
    if (cityEl) cityEl.style.display = 'none';
    if (cityTxt) cityTxt.textContent = '';

    updateNumWords();
    setZone('urban');

    const calcCard = g('calc-card');
    if (calcCard) calcCard.scrollIntoView({ behavior: 'smooth' });
    if (propInput) propInput.focus();
  }

  /**
   * Copies formatted estimate to clipboard
   */
  function copyResult() {
    if (!window._R) return;
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[currentLang] : null;
    if (!t) return;

    const labels = { crore: t.numCrore, lakh: t.numLakh, thousand: t.numThousand };
    const words = typeof window.numToWords === 'function' ? window.numToWords(window._R.val, labels) : '';
    const areaLbl = window._R.areaLabel || window._R.zone;

    const text = t.shareText(fmt(window._R.val), words, fmt(window._R.total), window._R.deedLbl, areaLbl);
    if (typeof window.executeCopy === 'function') {
      window.executeCopy(text, 'copyBtn', t.copied, t.copyFail);
    }
  }

  /**
   * Shares result via Web Share API or WhatsApp
   */
  function shareResult() {
    if (!window._R) return;
    const i18n = window.MH_I18N || {};
    const t = i18n.T ? i18n.T[currentLang] : null;
    if (!t) return;

    const labels = { crore: t.numCrore, lakh: t.numLakh, thousand: t.numThousand };
    const words = typeof window.numToWords === 'function' ? window.numToWords(window._R.val, labels) : '';
    const areaLbl = window._R.areaLabel || window._R.zone;

    const text = t.shareText(fmt(window._R.val), words, fmt(window._R.total), window._R.deedLbl, areaLbl);
    if (typeof window.executeShare === 'function') {
      window.executeShare({ title: t.copyHeader, text: text, url: window.location.href }, window.location.href);
    }
  }

  // Expose methods on window for HTML compatibility and module consumption
  window.switchLang       = switchLang;
  window.setZone          = setZone;
  window.setGender        = setGender;
  window.onAreaChange     = onAreaChange;
  window.updateDeedNote   = updateDeedNote;
  window.toggleMvInfo     = toggleMvInfo;
  window.updateNumWords   = updateNumWords;
  window.calculate        = calculate;
  window.resetCalc        = resetCalc;
  window.copyResult       = copyResult;
  window.shareResult      = shareResult;
  window.getAreaLabel     = getAreaLabel;
  window.clearError       = clearError;

  window.MH_UI = {
    switchLang,
    setZone,
    setGender,
    onAreaChange,
    updateDeedNote,
    toggleMvInfo,
    updateNumWords,
    calculate,
    resetCalc,
    copyResult,
    shareResult,
    getCurrentLang: () => currentLang,
    getCurrentZone: () => currentZone,
    getCurrentGender: () => currentGender
  };
})(window);
