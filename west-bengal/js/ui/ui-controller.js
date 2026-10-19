/**
 * West Bengal Stamp Duty Calculator - UI Controller
 * Manages DOM interactions, dynamic state updates, and rendering
 */

(function () {
  'use strict';

  let currentLang = 'en';
  let currentZone = 'urban';
  let currentGender = 'male';

  const TEXT_IDS = [
    'headerCta', 'heroBadge', 'heroSub',
    'pill1', 'pill2', 'pill3', 'pill4',
    'calcTitle', 'btnUrban', 'btnRural', 'labelArea', 'areaPlaceholder',
    'labelDeed', 'optDeedSale', 'optDeedGiftRel', 'optDeedGiftOther', 'optDeedPoa',
    'mvToggleTitle', 'labelValue', 'valueOptional', 'numWords', 'errValue', 'calcBtn',
    'resultLabel', 'breakdownTitle', 'brBaseStamp', 'brSurcharge', 'brTotalDuty', 'brRegFee', 'brTotal',
    'copyBtn', 'shareBtn', 'resetBtn', 'leadTitle', 'leadDesc',
    'acc1Title', 'acc2Title', 'acc3Title', 'acc4Title', 'acc5Title', 'acc1Note',
    'labelGender', 'genderMale', 'genderFemale', 'genderJoint', 'genderRebateTag', 'genderRebateText', 'brGenderRebate'
  ];

  const HTML_IDS = [
    'heroH1', 'mvToggleDesc', 'mvInfoBox', 'tooltipHtml', 'noteBox',
    'acc2Note', 'acc3Html', 'acc4Html', 'acc5Html', 'footerLine1', 'footerLine2',
    'editorialHeading', 'editorialSub', 'guideNum1', 'guideNum2', 'guideNum3', 'guideTitle1', 'guideTitle2', 'guideTitle3',
    'hidcoAccTitle', 'hidcoWarningHead', 'hidcoWhyDiff', 'hidcoThCharge', 'hidcoThTo', 'hidcoThWhen', 'hidcoThAmt',
    'hidcoLeaseholdNote', 'hidcoChecklistHead', 'hidcoChecklistUl',
    'newTownAATitle', 'newTownAAList', 'newTownAAStampNote'
  ];

  function getI18n() {
    return (window.WB_I18N_MODULE && window.WB_I18N_MODULE.WB_I18N)
      ? window.WB_I18N_MODULE.WB_I18N.T
      : {};
  }

  function getCalcEngine() {
    return (window.WB_CALCULATOR_MODULE && window.WB_CALCULATOR_MODULE.WB_CALCULATOR)
      ? window.WB_CALCULATOR_MODULE.WB_CALCULATOR
      : null;
  }

  function switchLang(lang) {
    currentLang = lang;
    const T = getI18n();
    const t = T[lang] || {};

    const html = g('html-root');
    if (html) {
      html.lang = lang === 'bn' ? 'bn' : 'en';
      html.classList.toggle('bn-active', lang === 'bn');
    }

    const enBtn = g('lang-en');
    const bnBtn = g('lang-bn');
    if (enBtn && bnBtn) {
      enBtn.classList.toggle('active', lang === 'en');
      bnBtn.classList.toggle('active', lang === 'bn');
      enBtn.setAttribute('aria-pressed', lang === 'en');
      bnBtn.setAttribute('aria-pressed', lang === 'bn');
    }

    TEXT_IDS.forEach(id => {
      const el = g(id);
      if (el && t[id] !== undefined) el.textContent = t[id];
    });

    HTML_IDS.forEach(id => {
      const el = g(id);
      if (el && t[id] !== undefined) el.innerHTML = t[id];
    });

    const ogKolkata = g('og-kolkata');
    if (ogKolkata && t.ogKolkata) ogKolkata.label = t.ogKolkata;
    const ogNorth = g('og-north');
    if (ogNorth && t.ogNorth) ogNorth.label = t.ogNorth;
    const ogSouth = g('og-south');
    if (ogSouth && t.ogSouth) ogSouth.label = t.ogSouth;

    const propInput = g('propertyValue');
    if (propInput) {
      propInput.placeholder = lang === 'bn' ? 'যেমন: ৭৫০০০০০' : 'e.g. 7500000';
    }

    const fb = g('floatCalcBtn');
    if (fb && t.floatCalcBtn) fb.innerHTML = t.floatCalcBtn;

    updateNumWords();
    updateDeedNote();
  }

  function updateDeedNote() {
    const deedEl = g('deedType');
    if (!deedEl) return;
    const deed = deedEl.value;
    const el = g('deedNoteBox');
    if (!el) return;
    const T = getI18n();
    const note = T[currentLang] && T[currentLang].deedNote ? T[currentLang].deedNote[deed] : null;
    if (note) {
      el.textContent = note;
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
      el.textContent = '';
    }
  }

  function setGender(gen) {
    currentGender = gen;
    ['male', 'female', 'joint'].forEach(v => {
      const btn = g('btn-' + v);
      if (btn) btn.classList.toggle('active', v === gen);
    });

    const hasRebate = (gen === 'female' || gen === 'joint');
    const rebateNote = g('genderRebateNote');
    if (rebateNote) rebateNote.classList.toggle('visible', hasRebate);
  }

  function setZone(z) {
    currentZone = z;
    ['urban', 'rural'].forEach(k => {
      const btn = g('btn-' + k);
      if (btn) btn.classList.remove('active');
    });

    const activeBtn = g('btn-' + z);
    if (activeBtn) activeBtn.classList.add('active');
    hideResults();
  }

  function hideResults() {
    const card = g('resultsCard');
    if (card) card.classList.remove('visible');
  }

  function toggleMvInfo() {
    const toggle = g('mvToggle');
    const box = g('mvInfoBox');
    if (toggle && box) {
      box.classList.toggle('visible', toggle.checked);
    }
  }

  function updateNumWords() {
    const propInput = g('propertyValue');
    if (!propInput) return;
    const v = parseFloat(propInput.value);
    const el = g('numWords');
    if (!el) return;
    const T = getI18n();
    const t = T[currentLang] || {};

    const labels = {
      crore: t.numCrore || 'Crore',
      lakh: t.numLakh || 'Lakh',
      thousand: t.numThousand || 'Thousand'
    };
    const w = typeof numToWords === 'function' ? numToWords(v, labels) : '';

    if (w) {
      el.textContent = (t.numPrefix || '= ₹ ') + w;
      el.classList.remove('empty');
    } else {
      el.textContent = t.numWordsDefault || '';
      el.classList.add('empty');
    }

    if (window.updateFloatBtnState) window.updateFloatBtnState();
  }

  function clearError() {
    const f = g('field-value');
    if (f) f.classList.remove('has-error');
    const err = g('err-value');
    if (err) err.classList.remove('visible');
  }

  function calculate() {
    const propInput = g('propertyValue');
    if (!propInput) return;
    const raw = propInput.value.trim();
    const val = parseFloat(raw);

    if (!raw || isNaN(val) || val <= 0) {
      const f = g('field-value');
      if (f) f.classList.add('has-error');
      const err = g('err-value');
      if (err) err.classList.add('visible');
      propInput.focus();
      return;
    }
    clearError();

    const deed = g('deedType').value;
    const calc = getCalcEngine();
    if (!calc) return;

    const res = calc.calculateWbStampDuty({
      propertyValue: val,
      zone: currentZone,
      deedType: deed,
      buyerGender: currentGender
    });

    const T = getI18n();
    const t = T[currentLang] || {};

    const area = g('areaSelect') ? g('areaSelect').value : '';
    const zoneLabel = currentZone === 'urban' ? t.zoneUrban : t.zoneRural;
    const deedLabel = t.deedLabel ? t.deedLabel[deed] : deed;

    // Header values
    g('resTotalDisplay').textContent = fmt(res.totalPayable);
    g('resSubLine').textContent = deedLabel + ' · ' + zoneLabel + (area ? ' · ' + area : '');

    // Base stamp row
    if (deed === 'poa') {
      g('resBaseRateBadge').textContent = '₹1k';
      g('resBaseAmt').textContent = fmt(1000);
    } else if (deed === 'gift_relative') {
      g('resBaseRateBadge').textContent = '0.5%';
      g('resBaseAmt').textContent = fmt(res.baseDuty);
    } else {
      g('resBaseRateBadge').textContent = (res.baseRate * 100) + '%';
      g('resBaseAmt').textContent = fmt(res.baseDuty);
    }

    // Surcharge row
    const surRow = g('row-surcharge');
    if (surRow) {
      if (res.hasSurcharge) {
        surRow.style.display = 'flex';
        g('resSurAmt').textContent = fmt(res.surchargeAmt);
      } else {
        surRow.style.display = 'none';
      }
    }

    // Gender rebate row
    const rebateRow = g('row-gender-rebate');
    if (rebateRow) {
      if (res.hasGenderRebate) {
        rebateRow.classList.add('visible');
        g('resGenderRebate').textContent = '−' + fmt(res.rebateAmt);
      } else {
        rebateRow.classList.remove('visible');
      }
    }

    // Effective stamp rate badge
    if (deed === 'poa') {
      g('resEffBadge').textContent = '₹1,000';
    } else if (deed === 'gift_relative') {
      g('resEffBadge').textContent = '0.5%';
    } else {
      g('resEffBadge').textContent = (res.effectiveDutyRate).toFixed(0) + '%';
    }

    g('resTotalDuty').textContent = fmt(res.totalDuty);
    g('resRegBadge').textContent = res.regRateLabel;
    g('resRegFee').textContent = fmt(res.regFee);
    g('resTotalPayable').textContent = fmt(res.totalPayable);

    const card = g('resultsCard');
    if (card) {
      card.classList.add('visible');
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    window._R = {
      val,
      total: res.totalPayable,
      duty: res.totalDuty,
      reg: res.regFee,
      area,
      zone: zoneLabel,
      deedLbl: deedLabel
    };
  }

  function resetCalc() {
    g('propertyValue').value = '';
    if (g('areaSelect')) g('areaSelect').value = '';
    g('deedType').value = 'sale';
    hideResults();
    setGender('male');
    if (g('mvToggle')) g('mvToggle').checked = false;
    if (g('mvInfoBox')) g('mvInfoBox').classList.remove('visible');
    if (g('deedNoteBox')) g('deedNoteBox').classList.remove('visible');
    updateNumWords();
    setZone('urban');
    g('calc-card').scrollIntoView({ behavior: 'smooth' });
    g('propertyValue').focus();
  }

  function copyResult() {
    if (!window._R) return;
    const T = getI18n();
    const t = T[currentLang] || {};
    const labels = { crore: t.numCrore, lakh: t.numLakh, thousand: t.numThousand };
    const words = typeof numToWords === 'function' ? numToWords(window._R.val, labels) : '';
    const areaLbl = window._R.area || window._R.zone;

    const text = typeof t.shareText === 'function'
      ? t.shareText(fmt(window._R.val), words, fmt(window._R.total), window._R.deedLbl, areaLbl)
      : `Stamp Duty on ${fmt(window._R.val)} in WB = ${fmt(window._R.total)}`;

    if (typeof executeCopy === 'function') {
      executeCopy(text, 'copyBtn', t.copied || '✓ Copied!', t.copyFail || 'Copy not supported.');
    }
  }

  function shareResult() {
    if (!window._R) return;
    const T = getI18n();
    const t = T[currentLang] || {};
    const labels = { crore: t.numCrore, lakh: t.numLakh, thousand: t.numThousand };
    const words = typeof numToWords === 'function' ? numToWords(window._R.val, labels) : '';
    const areaLbl = window._R.area || window._R.zone;

    const text = typeof t.shareText === 'function'
      ? t.shareText(fmt(window._R.val), words, fmt(window._R.total), window._R.deedLbl, areaLbl)
      : `Stamp Duty on ${fmt(window._R.val)} in WB = ${fmt(window._R.total)}`;

    if (typeof executeShare === 'function') {
      executeShare({
        title: t.copyHeader || 'West Bengal Stamp Duty Estimate',
        text: text,
        url: window.location.href
      }, window.location.href);
    }
  }

  // Expose global controller methods for inline HTML events
  window.switchLang = switchLang;
  window.setGender = setGender;
  window.setZone = setZone;
  window.toggleMvInfo = toggleMvInfo;
  window.updateDeedNote = updateDeedNote;
  window.updateNumWords = updateNumWords;
  window.calculate = calculate;
  window.resetCalc = resetCalc;
  window.copyResult = copyResult;
  window.shareResult = shareResult;
  window.hideResults = hideResults;

  window.WB_UI = {
    getCurrentLang: () => currentLang,
    getCurrentZone: () => currentZone,
    getCurrentGender: () => currentGender
  };
})();
