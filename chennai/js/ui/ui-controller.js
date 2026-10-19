/**
 * Chennai (Tamil Nadu) Stamp Duty Calculator - UI Controller
 */

(function (window) {
  'use strict';

  const g = (id) => (typeof window.g === 'function' ? window.g(id) : document.getElementById(id));
  const fmt = (n) => (typeof window.fmt === 'function' ? window.fmt(n) : '₹' + Math.round(n).toLocaleString('en-IN'));

  let currentLang = 'en';
  let currentGender = 'male';

  function switchLang(lang) {
    currentLang = lang;
    const i18n = window.CHENNAI_I18N ? window.CHENNAI_I18N[lang] : null;
    if (!i18n) return;

    const htmlRoot = g('html-root');
    if (htmlRoot) htmlRoot.lang = lang;
    document.body.classList.toggle('lang-ta', lang === 'ta');

    const btnEn = g('lang-en');
    const btnTa = g('lang-ta');
    if (btnEn) {
      btnEn.classList.toggle('active', lang === 'en');
      btnEn.setAttribute('aria-pressed', lang === 'en');
    }
    if (btnTa) {
      btnTa.classList.toggle('active', lang === 'ta');
      btnTa.setAttribute('aria-pressed', lang === 'ta');
    }

    const map = {
      heroBadge: i18n.heroBadge,
      heroH1: i18n.heroH1,
      heroSub: i18n.heroSub,
      pill1: i18n.pill1,
      pill2: i18n.pill2,
      pill3: i18n.pill3,
      pill4: i18n.pill4,
      calcTitle: i18n.calcTitle,
      labelDeed: i18n.labelDeed,
      optDeedSale: i18n.optDeedSale,
      optDeedGiftFamily: i18n.optDeedGiftFamily,
      optDeedSettlementFamily: i18n.optDeedSettlementFamily,
      optDeedGiftOther: i18n.optDeedGiftOther,
      labelBuyer: i18n.labelBuyer,
      buyerMale: i18n.buyerMale,
      buyerFemale: i18n.buyerFemale,
      buyerJoint: i18n.buyerJoint,
      femaleRebateNotice: i18n.femaleRebateNotice,
      labelAgreementVal: i18n.labelAgreementVal,
      labelGuidelineVal: i18n.labelGuidelineVal,
      calcRuleHint: i18n.calcRuleHint,
      calcBtn: i18n.calcBtn,
      resultTotalLabel: i18n.resultTotalLabel,
      breakdownTitle: i18n.breakdownTitle,
      copyBtn: i18n.copyBtn,
      shareBtn: i18n.shareBtn,
      resetBtn: i18n.resetBtn,
      disclaimerText: i18n.disclaimerText,
      tdsTitle: i18n.tdsTitle,
      tdsDesc: i18n.tdsDesc
    };

    Object.keys(map).forEach(id => {
      const el = g(id);
      if (el && map[id]) el.innerHTML = map[id];
    });

    const fb = g('floatCalcBtn');
    if (fb) fb.innerHTML = i18n.floatCalcBtn;

    updateNumWords();
  }

  function setBuyerGender(gender) {
    currentGender = gender;
    ['buyer-male', 'buyer-female', 'buyer-joint'].forEach(id => {
      const btn = g(id);
      if (btn) {
        const isMatch = (id === `buyer-${gender}`);
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-pressed', isMatch);
      }
    });

    const femaleNotice = g('femaleNoticeBox');
    if (femaleNotice) {
      femaleNotice.style.display = (gender === 'female') ? 'block' : 'none';
    }

    if (g('calcResults') && g('calcResults').style.display !== 'none') {
      calculate();
    }
  }

  function getLabels() {
    const i18n = window.CHENNAI_I18N ? window.CHENNAI_I18N[currentLang] : null;
    return {
      crore: i18n ? i18n.numCrore : 'Crore',
      lakh: i18n ? i18n.numLakh : 'Lakh',
      thousand: i18n ? i18n.numThousand : 'Thousand'
    };
  }

  function updateNumWords() {
    const agr = parseFloat(g('agreementValue') ? g('agreementValue').value : 0) || 0;
    const gui = parseFloat(g('guidelineValue') ? g('guidelineValue').value : 0) || 0;
    const maxVal = Math.max(agr, gui);

    const wordEl = g('numWords');
    if (!wordEl) return;

    if (maxVal > 0 && typeof window.numToWords === 'function') {
      const basis = (agr >= gui) ? 'Agreement Value' : 'Guideline Value';
      wordEl.textContent = `= ₹ ${window.numToWords(maxVal, getLabels())} (Chargeable on ${basis})`;
    } else {
      const i18n = window.CHENNAI_I18N ? window.CHENNAI_I18N[currentLang] : null;
      wordEl.textContent = i18n ? i18n.numWordsDefault : 'Enter property values above';
    }
  }

  function calculate() {
    const agrInput = g('agreementValue');
    const guiInput = g('guidelineValue');
    const deedInput = g('deedType');

    const agrVal = parseFloat(agrInput ? agrInput.value : 0) || 0;
    const guiVal = parseFloat(guiInput ? guiInput.value : 0) || 0;
    const deedType = deedInput ? deedInput.value : 'sale';

    const errEl = g('calcError');
    if (agrVal <= 0 && guiVal <= 0) {
      if (errEl) {
        errEl.textContent = (currentLang === 'ta')
          ? 'தயவுசெய்து சரியான சொத்து மதிப்பை உள்ளிடவும்.'
          : 'Please enter a valid Agreement or Guideline Value.';
        errEl.style.display = 'block';
      }
      return;
    }
    if (errEl) errEl.style.display = 'none';

    const calcEngine = window.CHENNAI_CALCULATOR_MODULE
      ? window.CHENNAI_CALCULATOR_MODULE.CHENNAI_CALCULATOR
      : null;

    if (!calcEngine) return;

    const res = calcEngine.calculateChennaiStampDuty({
      agreementValue: agrVal,
      guidelineValue: guiVal,
      deedType: deedType,
      buyerGender: currentGender
    });

    renderResults(res);
  }

  function renderResults(res) {
    const resultsBox = g('calcResults');
    if (!resultsBox) return;
    resultsBox.style.display = 'block';

    g('resultTotal').textContent = fmt(res.totalStatutoryOutgo);
    g('resultEffectiveRate').textContent = `${res.effectiveTotalRate}%`;
    g('resultBasis').textContent = `${fmt(res.chargeableVal)} (${res.valuationBasis === 'agreement' ? 'Agreement Value' : 'TN Guideline Value'})`;

    const breakdownTbody = g('breakdownBody');
    if (breakdownTbody) {
      breakdownTbody.innerHTML = '';
      res.breakdown.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.label}</td>
          <td style="text-align:right; font-weight:600;">${fmt(item.amount)}</td>
        `;
        breakdownTbody.appendChild(tr);
      });
    }

    const tdsCard = g('tdsInfoCard');
    if (tdsCard) {
      if (res.tdsApplicable) {
        tdsCard.style.display = 'block';
        g('tdsAmount').textContent = fmt(res.tdsAmount);
      } else {
        tdsCard.style.display = 'none';
      }
    }

    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function copyResult() {
    const total = g('resultTotal') ? g('resultTotal').textContent : '';
    const basis = g('resultBasis') ? g('resultBasis').textContent : '';
    const text = `Chennai Stamp Duty & Registration Result (StampDutyCalc.in)\nChargeable Property Value: ${basis}\nTotal Statutory Charges: ${total}\nCalculate online: https://stampdutycalc.in/chennai/`;
    if (typeof window.executeCopy === 'function') {
      window.executeCopy(text, 'copyBtn', '✓ Copied!', 'Failed to copy result.');
    }
  }

  function shareResult() {
    const total = g('resultTotal') ? g('resultTotal').textContent : '';
    const payload = {
      title: 'Chennai Stamp Duty & Registration Calculation',
      text: `Calculated Total Stamp Duty & Registration in Chennai: ${total} on StampDutyCalc.in`,
      url: window.location.href
    };
    if (typeof window.executeShare === 'function') {
      window.executeShare(payload, window.location.href);
    }
  }

  function resetCalc() {
    if (g('agreementValue')) g('agreementValue').value = '';
    if (g('guidelineValue')) g('guidelineValue').value = '';
    setBuyerGender('male');
    updateNumWords();
    if (g('calcResults')) g('calcResults').style.display = 'none';
    if (g('calcError')) g('calcError').style.display = 'none';
  }

  window.CHENNAI_UI = {
    switchLang,
    setBuyerGender,
    updateNumWords,
    calculate,
    copyResult,
    shareResult,
    resetCalc,
    getCurrentLang: () => currentLang
  };

  // Global triggers
  window.calculate = calculate;
  window.switchLang = switchLang;
  window.setBuyerGender = setBuyerGender;
  window.copyResult = copyResult;
  window.shareResult = shareResult;
  window.resetCalc = resetCalc;
})(window);
