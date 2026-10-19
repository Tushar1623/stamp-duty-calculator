/**
 * Delhi (NCT) Stamp Duty Calculator - UI Controller
 */

(function (window) {
  'use strict';

  const g = (id) => (typeof window.g === 'function' ? window.g(id) : document.getElementById(id));
  const fmt = (n) => (typeof window.fmt === 'function' ? window.fmt(n) : '₹' + Math.round(n).toLocaleString('en-IN'));

  let currentLang = 'en';
  let currentGender = 'male';

  function switchLang(lang) {
    currentLang = lang;
    const i18n = window.DELHI_I18N ? window.DELHI_I18N[lang] : null;
    if (!i18n) return;

    const htmlRoot = g('html-root');
    if (htmlRoot) htmlRoot.lang = lang;
    document.body.classList.toggle('lang-hi', lang === 'hi');

    const btnEn = g('lang-en');
    const btnHi = g('lang-hi');
    if (btnEn) {
      btnEn.classList.toggle('active', lang === 'en');
      btnEn.setAttribute('aria-pressed', lang === 'en');
    }
    if (btnHi) {
      btnHi.classList.toggle('active', lang === 'hi');
      btnHi.setAttribute('aria-pressed', lang === 'hi');
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
      optDeedGift: i18n.optDeedGift,
      labelMunicipal: i18n.labelMunicipal,
      optMcd: i18n.optMcd,
      optNdmc: i18n.optNdmc,
      labelBuyer: i18n.labelBuyer,
      buyerMale: i18n.buyerMale,
      buyerFemale: i18n.buyerFemale,
      buyerJoint: i18n.buyerJoint,
      femaleRebateNotice: i18n.femaleRebateNotice,
      labelAgreementVal: i18n.labelAgreementVal,
      labelCircleRateVal: i18n.labelCircleRateVal,
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
      femaleNotice.style.display = (gender === 'female' || gender === 'joint') ? 'block' : 'none';
    }

    if (g('calcResults') && g('calcResults').style.display !== 'none') {
      calculate();
    }
  }

  function getLabels() {
    const i18n = window.DELHI_I18N ? window.DELHI_I18N[currentLang] : null;
    return {
      crore: i18n ? i18n.numCrore : 'Crore',
      lakh: i18n ? i18n.numLakh : 'Lakh',
      thousand: i18n ? i18n.numThousand : 'Thousand'
    };
  }

  function updateNumWords() {
    const agr = parseFloat(g('agreementValue') ? g('agreementValue').value : 0) || 0;
    const cir = parseFloat(g('circleRateValue') ? g('circleRateValue').value : 0) || 0;
    const maxVal = Math.max(agr, cir);

    const wordEl = g('numWords');
    if (!wordEl) return;

    if (maxVal > 0 && typeof window.numToWords === 'function') {
      const basis = (agr >= cir) ? 'Agreement Value' : 'Delhi Circle Rate';
      wordEl.textContent = `= ₹ ${window.numToWords(maxVal, getLabels())} (Chargeable on ${basis})`;
    } else {
      const i18n = window.DELHI_I18N ? window.DELHI_I18N[currentLang] : null;
      wordEl.textContent = i18n ? i18n.numWordsDefault : 'Enter property values above';
    }
  }

  function calculate() {
    const agrInput = g('agreementValue');
    const cirInput = g('circleRateValue');
    const deedInput = g('deedType');
    const muniInput = g('municipalArea');

    const agrVal = parseFloat(agrInput ? agrInput.value : 0) || 0;
    const cirVal = parseFloat(cirInput ? cirInput.value : 0) || 0;
    const deedType = deedInput ? deedInput.value : 'sale';
    const municipalArea = muniInput ? muniInput.value : 'mcd';

    const errEl = g('calcError');
    if (agrVal <= 0 && cirVal <= 0) {
      if (errEl) {
        errEl.textContent = (currentLang === 'hi')
          ? 'कृपया मान्य संपत्ति मूल्य दर्ज करें।'
          : 'Please enter a valid Agreement or Circle Rate Value.';
        errEl.style.display = 'block';
      }
      return;
    }
    if (errEl) errEl.style.display = 'none';

    const calcEngine = window.DELHI_CALCULATOR_MODULE
      ? window.DELHI_CALCULATOR_MODULE.DELHI_CALCULATOR
      : null;

    if (!calcEngine) return;

    const res = calcEngine.calculateDelhiStampDuty({
      agreementValue: agrVal,
      circleRateValue: cirVal,
      buyerGender: currentGender,
      municipalArea: municipalArea,
      deedType: deedType
    });

    renderResults(res);
  }

  function renderResults(res) {
    const resultsBox = g('calcResults');
    if (!resultsBox) return;
    resultsBox.style.display = 'block';

    g('resultTotal').textContent = fmt(res.totalStatutoryOutgo);
    g('resultEffectiveRate').textContent = `${res.effectiveTotalRate}%`;
    g('resultBasis').textContent = `${fmt(res.chargeableVal)} (${res.valuationBasis === 'agreement' ? 'Agreement Value' : 'Delhi Circle Rate'})`;

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

    const savingsBox = g('femaleSavingsAlert');
    if (savingsBox) {
      if (res.femaleRebateSavings > 0) {
        savingsBox.style.display = 'block';
        g('savingsAmt').textContent = fmt(res.femaleRebateSavings);
      } else {
        savingsBox.style.display = 'none';
      }
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
    const text = `Delhi Stamp Duty & Registration Result (StampDutyCalc.in)\nChargeable Property Value: ${basis}\nTotal Statutory Charges: ${total}\nCalculate online: https://stampdutycalc.in/delhi/`;
    if (typeof window.executeCopy === 'function') {
      window.executeCopy(text, 'copyBtn', '✓ Copied!', 'Failed to copy result.');
    }
  }

  function shareResult() {
    const total = g('resultTotal') ? g('resultTotal').textContent : '';
    const payload = {
      title: 'Delhi Stamp Duty & Registration Calculation',
      text: `Calculated Total Stamp Duty & Registration in Delhi: ${total} on StampDutyCalc.in`,
      url: window.location.href
    };
    if (typeof window.executeShare === 'function') {
      window.executeShare(payload, window.location.href);
    }
  }

  function resetCalc() {
    if (g('agreementValue')) g('agreementValue').value = '';
    if (g('circleRateValue')) g('circleRateValue').value = '';
    setBuyerGender('male');
    updateNumWords();
    if (g('calcResults')) g('calcResults').style.display = 'none';
    if (g('calcError')) g('calcError').style.display = 'none';
  }

  window.DELHI_UI = {
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
