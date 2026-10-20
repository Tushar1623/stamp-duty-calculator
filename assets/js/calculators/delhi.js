/**
 * Delhi (NCT) Stamp Duty & Registration Calculator — Unified Vanilla JS Module
 * Self-contained: includes statutory rates, bilingual i18n, calculation engine, UI controller, and bootstrap.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    global.window = global.window || global;
    module.exports = factory(global.window);
  } else {
    factory(root);
  }
})(typeof self !== 'undefined' ? self : this, function (window) {
  'use strict';

  // --- 1. RATES DATA ---
  const STATE_STAMP_DUTY = { male: 0.03, female: 0.02, joint: 0.025 };
  const MCD_TRANSFER_DUTY = {
    threshold: 2500000,
    sub25L: { male: 0.03, female: 0.02, joint: 0.025 },
    above25L: { male: 0.04, female: 0.03, joint: 0.035 }
  };
  const REGISTRATION_FEE_RATE = 0.01;
  const PASTING_FEE = 100;

  function getDelhiRates(gender, val, municipalArea) {
    const gKey = (gender === 'female' || gender === 'joint') ? gender : 'male';
    const stateDutyRate = STATE_STAMP_DUTY[gKey];
    let mcdTransferRate = 0;
    if (municipalArea !== 'ndmc_cantt') {
      const isAbove25L = (val > MCD_TRANSFER_DUTY.threshold);
      mcdTransferRate = isAbove25L ? MCD_TRANSFER_DUTY.above25L[gKey] : MCD_TRANSFER_DUTY.sub25L[gKey];
    }
    return {
      genderKey: gKey,
      stateDutyRate,
      mcdTransferRate,
      totalStampDutyRate: stateDutyRate + mcdTransferRate,
      registrationRate: REGISTRATION_FEE_RATE,
      pastingFee: PASTING_FEE
    };
  }

  const DELHI_RATES = {
    STATE_STAMP_DUTY,
    MCD_TRANSFER_DUTY,
    REGISTRATION_FEE_RATE,
    PASTING_FEE,
    getDelhiRates
  };
  window.DELHI_RATES = DELHI_RATES;
  window.DELHI_RATES_MODULE = { DELHI_RATES };

  // --- 2. I18N STRINGS ---
/**
 * Delhi (NCT) Stamp Duty Calculator - Internationalization (i18n) Configuration
 * Supports English ('en') and Hindi ('hi')
 */

const DELHI_I18N = {
  en: {
    heroBadge: "Delhi · National Capital Territory · 2025–2026 Rates",
    heroH1: "Calculate <em>Stamp Duty</em><br>&amp; Registration in Delhi",
    heroSub: "Instant calculations for South Delhi, Dwarka, Rohini, Vasant Kunj, MCD &amp; NDMC areas.",
    pill1: "✓ Delhi Revenue Dept &amp; MCD Verified",
    pill2: "✓ 2% Women Buyer Concession",
    pill3: "✓ MCD Transfer Duty (4% / 3%)",
    pill4: "✓ Free Forever",
    calcTitle: "Delhi Property Stamp Duty Calculator",
    labelDeed: "Deed / Instrument Type",
    optDeedSale: "Sale / Conveyance Deed (Standard Purchase)",
    optDeedGift: "Gift Deed (Conveyance Schedule by Donee Gender)",
    labelMunicipal: "Municipal Area / Authority",
    optMcd: "MCD Limits (Municipal Corporation of Delhi)",
    optNdmc: "NDMC / Delhi Cantonment Board Limits",
    labelBuyer: "Buyer / Ownership Category",
    buyerMale: "Individual Male (7% Duty + 1% Reg = 8%)",
    buyerFemale: "Sole Female Buyer (5% Duty + 1% Reg = 6%)",
    buyerJoint: "Joint (Husband &amp; Wife / M+F: 6% Duty + 1% Reg = 7%)",
    femaleRebateNotice: "Women buyers receive a 200 bps (2%) statutory rebate on base stamp duty (4% vs 6% in sub-25L; 5% vs 7% in >25L MCD).",
    labelAgreementVal: "Agreement / Consideration Value (₹)",
    labelCircleRateVal: "Delhi Govt Circle Rate Valuation (₹)",
    calcRuleHint: "Stamp duty is legally calculated on the <b>higher</b> of Agreement Value and Government Circle Rate Valuation.",
    numWordsDefault: 'e.g. 10000000 for "1 Crore"',
    calcBtn: "⚡ Calculate Stamp Duty &amp; Registration",
    resultTotalLabel: "Total Statutory Government Outgo",
    breakdownTitle: "Itemized Statutory Breakdown",
    valBasisLabel: "Chargeable Property Value:",
    effectiveRateLabel: "Effective Combined Tariff:",
    disclaimerText: "Rates as per <b>Delhi Department of Revenue &amp; MCD Gazette Notifications 2025–2026</b>. Rates last verified May 2026. For circle rate categories A through H, visit <a href='https://revenue.delhi.gov.in' target='_blank' rel='noopener'>revenue.delhi.gov.in</a>.",
    copyBtn: "📋 Copy Result",
    shareBtn: "↗ Share",
    resetBtn: "↩ Reset",
    floatCalcBtn: "⚡ Calculate",
    numCrore: "Crore",
    numLakh: "Lakh",
    numThousand: "Thousand",
    tdsTitle: "Income Tax TDS under Section 194-IA (Separate Obligation)",
    tdsDesc: "For property purchases of ₹50 Lakhs or more, the buyer must deduct 1% TDS from payments to the seller and remit it via Form 26QB. This is separate from stamp duty & registration."
  },
  hi: {
    heroBadge: "दिल्ली · राष्ट्रीय राजधानी क्षेत्र · 2025–2026 दरें",
    heroH1: "दिल्ली में <em>स्टाम्प ड्यूटी</em><br>&amp; संपत्ति पंजीकरण शुल्क की गणना",
    heroSub: "दक्षिण दिल्ली, द्वारका, रोहिणी, वसंत कुंज, MCD एवं NDMC क्षेत्रों के लिए सटीक गणना।",
    pill1: "✓ दिल्ली राजस्व विभाग एवं MCD द्वारा सत्यापित",
    pill2: "✓ महिला खरीदारों को 2% की विशेष छूट",
    pill3: "✓ MCD ट्रांसफर ड्यूटी सम्मिलित",
    pill4: "✓ पूर्णतः निःशुल्क",
    calcTitle: "दिल्ली संपत्ति स्टाम्प ड्यूटी एवं पंजीकरण शुल्क कैलकुलेटर",
    labelDeed: "विलेख / दस्तावेज का प्रकार",
    optDeedSale: "बिक्री विलेख (सेल डीड - सामान्य खरीद)",
    optDeedGift: "उपहार विलेख (गिफ्ट डीड)",
    labelMunicipal: "नगर निगम / प्रशासनिक क्षेत्र",
    optMcd: "MCD क्षेत्र (दिल्ली नगर निगम)",
    optNdmc: "NDMC / दिल्ली छावनी परिषद क्षेत्र",
    labelBuyer: "खरीदार का विवरण",
    buyerMale: "पुरुष खरीदार (7% ड्यूटी + 1% पंजीकरण = 8%)",
    buyerFemale: "महिला खरीदार (5% ड्यूटी + 1% पंजीकरण = 6%)",
    buyerJoint: "संयुक्त स्वामित्व (पति एवं पत्नी: 6% ड्यूटी + 1% पंजीकरण = 7%)",
    femaleRebateNotice: "महिला खरीदारों को मूल स्टाम्प ड्यूटी में 2% (200 bps) की वैधानिक छूट मिलती है।",
    labelAgreementVal: "अनुबंध मूल्य (Agreement Value) (₹)",
    labelCircleRateVal: "दिल्ली सरकार सर्किल रेट मूल्यांकन (₹)",
    calcRuleHint: "स्टाम्प ड्यूटी अनुबंध मूल्य या सर्किल रेट मूल्यांकन में से <b>जो भी अधिक हो</b>, उस पर लगाई जाती है।",
    numWordsDefault: 'उदा: 10000000 ("1 करोड़")',
    calcBtn: "⚡ शुल्क की गणना करें",
    resultTotalLabel: "कुल सरकारी वैधानिक खर्च",
    breakdownTitle: "मदवार शुल्क विवरण",
    valBasisLabel: "प्रभार्य संपत्ति मूल्य:",
    effectiveRateLabel: "प्रभावी कुल प्रतिशत दर:",
    disclaimerText: "दरें <b>दिल्ली राजस्व विभाग एवं MCD गजट अधिसूचना 2025–2026</b> के अनुसार हैं। आधिकारिक सर्किल रेट के लिए <a href='https://revenue.delhi.gov.in' target='_blank' rel='noopener'>revenue.delhi.gov.in</a> पर जाएं।",
    copyBtn: "📋 परिणाम कॉपी करें",
    shareBtn: "↗ शेयर करें",
    resetBtn: "↩ नई गणना",
    floatCalcBtn: "⚡ गणना करें",
    numCrore: "करोड़",
    numLakh: "लाख",
    numThousand: "हज़ार",
    tdsTitle: "आयकर धारा 194-IA के तहत TDS",
    tdsDesc: "₹50 लाख या अधिक की संपत्ति खरीद पर विक्रेता को भुगतान से 1% TDS काटकर फॉर्म 26QB द्वारा जमा करना अनिवार्य है।"
  }
};



  window.DELHI_I18N = (typeof DELHI_I18N !== 'undefined') ? DELHI_I18N : {};

  // --- 3. CALCULATION ENGINE ---
  function calculateDelhiStampDuty(params) {
    const agreementVal = Math.max(0, Number(params.agreementValue) || 0);
    const circleRateVal = Math.max(0, Number(params.circleRateValue) || 0);
    const buyerGender = params.buyerGender || 'male';
    const municipalArea = params.municipalArea || 'mcd';
    const deedType = params.deedType || 'sale';

    const chargeableVal = Math.max(agreementVal, circleRateVal);
    const valuationBasis = agreementVal >= circleRateVal ? 'agreement' : 'circle_rate';

    if (chargeableVal <= 0) {
      return {
        chargeableVal: 0, agreementVal, circleRateVal, valuationBasis,
        buyerGender, municipalArea, deedType,
        stateStampDuty: 0, mcdTransferDuty: 0, totalStampDuty: 0,
        registrationFee: 0, pastingFee: 0, totalStatutoryOutgo: 0,
        effectiveTotalRate: 0, tdsApplicable: false, tdsAmount: 0,
        femaleRebateSavings: 0, breakdown: []
      };
    }

    const rates = DELHI_RATES.getDelhiRates(buyerGender, chargeableVal, municipalArea);
    const stateStampDuty = Math.round(chargeableVal * rates.stateDutyRate);
    const mcdTransferDuty = Math.round(chargeableVal * rates.mcdTransferRate);
    const totalStampDuty = stateStampDuty + mcdTransferDuty;
    const registrationFee = Math.round(chargeableVal * rates.registrationRate);
    const pastingFee = rates.pastingFee || 100;
    const totalStatutoryOutgo = totalStampDuty + registrationFee + pastingFee;
    const effectiveTotalRate = (totalStatutoryOutgo / chargeableVal) * 100;

    const maleRates = DELHI_RATES.getDelhiRates('male', chargeableVal, municipalArea);
    const maleTotalDuty = Math.round(chargeableVal * maleRates.totalStampDutyRate);
    const femaleRebateSavings = (buyerGender === 'female' || buyerGender === 'joint')
      ? Math.max(0, maleTotalDuty - totalStampDuty)
      : 0;

    const tdsApplicable = (chargeableVal >= 5000000 && deedType === 'sale');
    const tdsAmount = tdsApplicable ? Math.round(chargeableVal * 0.01) : 0;

    return {
      chargeableVal, agreementVal, circleRateVal, valuationBasis,
      buyerGender, municipalArea, deedType,
      stateStampDuty, mcdTransferDuty, totalStampDuty,
      registrationFee, pastingFee, totalStatutoryOutgo,
      effectiveTotalRate, tdsApplicable, tdsAmount,
      femaleRebateSavings, rates
    };
  }

  const DELHI_CALCULATOR = { calculateDelhiStampDuty };
  window.DELHI_CALCULATOR = DELHI_CALCULATOR;
  window.DELHI_CALCULATOR_MODULE = { DELHI_CALCULATOR };

  // --- 4. UI CONTROLLER & APP BOOTSTRAP (BROWSER ONLY) ---
  if (typeof document !== 'undefined') {
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

  }

  return {
    DELHI_CALCULATOR,
    DELHI_RATES
  };
});
