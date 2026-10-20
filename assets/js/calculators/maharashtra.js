/**
 * Maharashtra Stamp Duty & Registration Calculator — Unified Vanilla JS Module
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
/**
 * Maharashtra Stamp Duty Calculator - Rates and Statutory Slabs Configuration
 * Rates as per Maharashtra Stamp Act & IGR Maharashtra Annual Statement of Rates (ASR) 2025-2026.
 */

// Registration Fee Formula:
// - Up to ₹30 Lakhs: 1% of Market Value
// - Above ₹30 Lakhs: Flat ₹30,000 maximum cap under Maharashtra Stamp Rules
function getRegFee(val) {
  if (!val || val <= 0) return 0;
  return val > 3000000 ? 30000 : Math.ceil(val * 0.01);
}

// Rates Lookup Table:
// Returns { base, metro, lbt } rates as decimals
function getRates(area, gender, zone) {
  const female = (gender === 'female'); // Sole female owner gets 1% rebate on base rate

  // Navi Mumbai (NMMC/CIDCO) & Thane (TMC): 5% base (4% female) + 1% Metro Cess + 1% LBT = 7% (6% female)
  if (area === 'navi-mumbai' || area === 'thane') {
    return {
      base: female ? 0.04 : 0.05,
      metro: 0.01,
      lbt: 0.01
    };
  }

  // Mumbai City (BMC - South) & Mumbai Suburban: 5% base (4% female) + 1% Metro Cess + 0% LBT = 6% (5% female)
  if (area === 'mumbai-city' || area === 'mumbai-suburban') {
    return {
      base: female ? 0.04 : 0.05,
      metro: 0.01,
      lbt: 0
    };
  }

  // Other Districts (Pune, Nagpur, Nashik, etc.):
  // Urban / Corp: 7% (6% female)
  // Municipal Council: 6% (5% female)
  // Rural / Gram Panchayat: 5% (4% female)
  const zoneRateMap = {
    urban:       female ? 0.06 : 0.07,
    mun_council: female ? 0.05 : 0.06,
    rural:       female ? 0.04 : 0.05,
  };

  return {
    base: zoneRateMap[zone || 'urban'],
    metro: 0,
    lbt: 0
  };
}

// Deeds Configuration
const DEED = {
  sale: {
    stampFn: (v, r) => Math.round(v * (r.base + r.metro + r.lbt)),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  gift_relative: {
    stampFn: (v) => Math.round(v * 0.02),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  gift_other: {
    stampFn: (v, r) => Math.round(v * (r.base + r.metro + r.lbt)),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  poa: {
    stampFn: () => 500,
    regFn: () => 200,
    regLabel: '₹200 flat'
  },
};

// Expose globally
window.MH_RATES = {
  getRegFee,
  getRates,
  DEED
};


  // --- 2. I18N STRINGS ---
/**
 * Maharashtra Stamp Duty Calculator - Internationalization (i18n) Configuration
 * Supports English ('en') and Marathi ('mr')
 */

const T = {
  en: {
    headerCta: "Calculate Now ↓",
    heroBadge: "Maharashtra · 2025-2026 · Current Rates",
    heroH1: 'Calculate <em>Stamp Duty</em><br>&amp; Registration in Maharashtra',
    heroSub: "Instant, accurate calculations — Navi Mumbai, Thane, Mumbai City, Suburban &amp; all districts.",
    pill1: "✓ Metro Cess &amp; LBT Included",
    pill2: "✓ Reg. Fee Capped at ₹30,000",
    pill3: "✓ Female Rebate 1%",
    pill4: "✓ Free Forever",
    calcTitle: "Maharashtra Property Calculator",
    labelArea: "Area / City",
    areaPlaceholder: "— Select Area —",
    labelZone: "Property Zone",
    labelDeed: "Deed Type",
    optDeedSale: "Sale / Transfer Deed",
    optDeedGiftRel: "Gift Deed — Blood Relative",
    optDeedGiftOther: "Gift Deed — Non-Relative",
    optDeedPoa: "Power of Attorney (General)",
    mvToggleTitle: "Agreement Value lower than Ready Reckoner?",
    mvToggleDesc: "Stamp duty is always on the <b>higher</b> of Ready Reckoner (circle rate) or Agreement Value. Tap to learn more.",
    labelValue: "Market / Ready Reckoner Value",
    valueOptional: "(use whichever is higher)",
    tooltipHtml: "<b>Ready Reckoner = IGR Maharashtra's minimum price.</b><br>If deal is ₹50L but RR is ₹65L, enter <b>₹65L</b>. Find your rate at igrmaharashtra.gov.in",
    numWordsDefault: 'e.g. type 5500000 for "55 Lakhs"',
    errValue: "Please enter a valid property value.",
    calcBtn: "⚡ Calculate Stamp Duty &amp; Registration",
    resultLabel: "Total Government Charges",
    breakdownTitle: "Detailed Breakdown",
    brBaseStamp: "Base Stamp Duty",
    brMetroCess: "Metro Cess",
    brLBT: "Local Body Tax (LBT)",
    brTotalDuty: "Total Stamp Duty",
    brRegFee: "Registration Fee",
    brTotal: "Total Payable",
    brGenderRebate: "Female Sole-Owner Rebate",
    labelGender: "Buyer / Ownership Type",
    genderMale: "Male",
    genderFemale: "Female Only",
    genderJoint: "Joint (M+F)",
    genderRebateTag: "−1%",
    genderRebateText: "Female sole-owner rebate: 1% off base stamp duty. Joint (male+female) buyers attract standard male rates.",
    noteBox: "<b>Note:</b> This estimate is based on Maharashtra government rates for 2025-2026. Final amount is determined by the Sub-Registrar's office based on IGR Maharashtra Ready Reckoner rates, property category, and applicable exemptions. Verify at igrmaharashtra.gov.in.",
    copyBtn: "📋 Copy Result",
    shareBtn: "↗ Share",
    resetBtn: "↩ New Calc",
    leadTitle: "Need a Free Property Valuation?",
    leadDesc: "Talk to a registered valuer for your area. Ready Reckoner rates, fair market value &amp; registration guidance — free consultation.",
    floatCalcBtn: "⚡ Calculate",
    footerLine1: 'Rates as per <b>Maharashtra Stamp Act &amp; IGR Maharashtra ASR 2025-2026</b>. For official Ready Reckoner rates, visit <a href="https://igrmaharashtra.gov.in" target="_blank" rel="noopener">igrmaharashtra.gov.in</a>',
    footerLine2: '© 2026 StampDutyCalc.in · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/disclaimer.html">Disclaimer</a> · Not legal advice',
    numCrore: "Crore",
    numLakh: "Lakh",
    numThousand: "Thousand",
    numPrefix: "= ₹ ",
    deedLabel: {
      sale: "Sale Deed",
      gift_relative: "Gift Deed (Blood Relative)",
      gift_other: "Gift Deed (Non-Relative)",
      poa: "Power of Attorney"
    },
    deedNote: {
      sale: null,
      gift_relative: "⚠️ Gift to blood relative: Stamp duty is 2% flat — no cess applies. Registration fee is 1% (capped ₹30,000). Eligible relatives: spouse, parent, child, sibling, grandchild.",
      gift_other: "📋 Gift to non-relative: Standard stamp duty rates apply (same as Sale Deed).",
      poa: "📋 General POA: stamp duty ₹500 flat + registration ₹200 flat. Property value is for reference only."
    },
    copied: "✓ Copied!",
    copyFail: "Copy not supported. Please select and copy manually.",
    shareText: (val, words, total, deed, area) => `Stamp Duty on ${val} (${words}) in Maharashtra = ${total} · ${deed} · ${area}. StampDutyCalc.in`,
    copyHeader: "Maharashtra Stamp Duty Estimate (StampDutyCalc.in)",
    lDeed: "Deed Type",
    lVal: "Property Value",
    lArea: "Area",
    lDuty: "Stamp Duty",
    lReg: "Registration Fee",
    lTotal: "TOTAL",
    editorialHeading: "Maharashtra Property Registration — Guides &amp; Resources",
    editorialSub: "In-depth articles curated by Maharashtra property professionals.",
  },
  mr: {
    headerCta: "आता मोजा ↓",
    heroBadge: "महाराष्ट्र · 2025-2026 · सद्य दर",
    heroH1: 'महाराष्ट्रात <em>मुद्रांक शुल्क</em><br>आणि नोंदणी मोजा',
    heroSub: "तात्काळ, अचूक गणना — नवी मुंबई, ठाणे, मुंबई शहर, उपनगर आणि सर्व जिल्हे.",
    pill1: "✓ मेट्रो उपकर आणि LBT समाविष्ट",
    pill2: "✓ नोंदणी शुल्क जास्तीत जास्त ₹30,000",
    pill3: "✓ महिला सूट 1%",
    pill4: "✓ कायमचे मोफत",
    calcTitle: "महाराष्ट्र मालमत्ता कॅल्क्युलेटर",
    labelArea: "क्षेत्र / शहर",
    areaPlaceholder: "— क्षेत्र निवडा —",
    labelZone: "मालमत्ता क्षेत्र",
    labelDeed: "दस्तऐवजाचा प्रकार",
    optDeedSale: "विक्री / हस्तांतरण दस्तऐवज",
    optDeedGiftRel: "दान दस्तऐवज — रक्ताचे नातेवाईक",
    optDeedGiftOther: "दान दस्तऐवज — अनात्मीय",
    optDeedPoa: "पॉवर ऑफ अटर्नी (सामान्य)",
    mvToggleTitle: "करारमूल्य रेडी रेकनरपेक्षा कमी आहे का?",
    mvToggleDesc: "मुद्रांक शुल्क नेहमी रेडी रेकनर किंवा करारमूल्य यापैकी <b>जे जास्त असेल</b> त्यावर आकारले जाते.",
    labelValue: "बाजार / रेडी रेकनर मूल्य",
    valueOptional: "(जे जास्त असेल ते वापरा)",
    tooltipHtml: "<b>रेडी रेकनर = IGR महाराष्ट्राची किमान किंमत.</b><br>व्यवहार ₹50L असला पण RR ₹65L असेल तर <b>₹65L</b> टाका. igrmaharashtra.gov.in वर तपासा.",
    numWordsDefault: 'उदा: 5500000 टाकल्यास "55 लाख" दिसेल',
    errValue: "कृपया वैध मालमत्ता मूल्य टाका.",
    calcBtn: "⚡ मुद्रांक शुल्क आणि नोंदणी मोजा",
    resultLabel: "एकूण सरकारी शुल्क",
    breakdownTitle: "तपशीलवार हिशोब",
    brBaseStamp: "मूळ मुद्रांक शुल्क",
    brMetroCess: "मेट्रो उपकर",
    brLBT: "स्थानिक संस्था कर (LBT)",
    brTotalDuty: "एकूण मुद्रांक शुल्क",
    brRegFee: "नोंदणी शुल्क",
    brTotal: "एकूण देय",
    brGenderRebate: "महिला एकमेव मालकीण सूट",
    labelGender: "खरेदीदार / मालकीचा प्रकार",
    genderMale: "पुरुष",
    genderFemale: "महिला (एकट्या)",
    genderJoint: "संयुक्त (पु+म)",
    genderRebateTag: "−1%",
    genderRebateText: "महिला एकमेव मालकीण सूट: मूळ मुद्रांक शुल्कावर 1% सूट. संयुक्त (पुरुष+महिला) नोंदणीवर सामान्य दर लागतो.",
    noteBox: "<b>नोंद:</b> हा 2025-2026 च्या महाराष्ट्र सरकारच्या दरांवर आधारित अंदाज आहे. अंतिम रक्कम उप-निबंधक कार्यालयाद्वारे IGR महाराष्ट्र रेडी रेकनर दरांनुसार ठरवली जाते. igrmaharashtra.gov.in वर तपासा.",
    copyBtn: "📋 निकाल कॉपी करा",
    shareBtn: "↗ शेअर करा",
    resetBtn: "↩ नवीन गणना",
    leadTitle: "मोफत मालमत्ता मूल्यांकन हवे आहे का?",
    leadDesc: "तुमच्या क्षेत्रातील नोंदणीकृत मूल्यांकनकाराशी बोला. रेडी रेकनर दर, बाजार मूल्य आणि नोंदणी मार्गदर्शन — मोफत सल्लामसलत.",
    floatCalcBtn: "⚡ मोजा",
    footerLine1: 'दर <b>महाराष्ट्र मुद्रांक कायदा आणि IGR महाराष्ट्र ASR 2025-2026</b> नुसार. अधिकृत रेडी रेकनर दरांसाठी <a href="https://igrmaharashtra.gov.in" target="_blank" rel="noopener">igrmaharashtra.gov.in</a> पहा',
    footerLine2: '© 2026 StampDutyCalc.in · <a href="/privacy-policy.html">गोपनीयता</a> · <a href="/disclaimer.html">अस्वीकरण</a> · कायदेशीर सल्ला नाही',
    numCrore: "कोटी",
    numLakh: "लाख",
    numThousand: "हजार",
    numPrefix: "= ₹ ",
    deedLabel: {
      sale: "विक्री दस्तऐवज",
      gift_relative: "दान दस्तऐवज (रक्ताचे नातेवाईक)",
      gift_other: "दान दस्तऐवज (अनात्मीय)",
      poa: "पॉवर ऑफ अटर्नी"
    },
    deedNote: {
      sale: null,
      gift_relative: "⚠️ रक्ताच्या नातेवाईकाला दान: मुद्रांक शुल्क 2% (निश्चित) — कोणताही उपकर नाही. नोंदणी शुल्क 1% (जास्तीत जास्त ₹30,000). पात्र नातेवाईक: पती/पत्नी, पालक, मुले, भाऊ-बहीण, नातवंडे.",
      gift_other: "📋 अनात्मीयाला दान: विक्री दस्तऐवजासारखेच सामान्य दर लागतात.",
      poa: "📋 सामान्य POA: मुद्रांक शुल्क ₹500 (निश्चित) + नोंदणी ₹200 (निश्चित)."
    },
    copied: "✓ कॉपी झाले!",
    copyFail: "कॉपी करणे शक्य नाही.",
    shareText: (val, words, total, deed, area) => `महाराष्ट्रात ${val} (${words}) मालमत्तेवर मुद्रांक शुल्क = ${total} · ${deed} · ${area}. StampDutyCalc.in`,
    copyHeader: "महाराष्ट्र मुद्रांक शुल्क अंदाज (StampDutyCalc.in)",
    lDeed: "दस्तऐवजाचा प्रकार",
    lVal: "मालमत्ता मूल्य",
    lArea: "क्षेत्र",
    lDuty: "मुद्रांक शुल्क",
    lReg: "नोंदणी शुल्क",
    lTotal: "एकूण",
    editorialHeading: "महाराष्ट्र मालमत्ता नोंदणी — मार्गदर्शक आणि संसाधने",
    editorialSub: "मुद्रांक शुल्क, रेडी रेकनर दर आणि IGR नोंदणी सहज समजून घेण्यासाठी महाराष्ट्रातील मालमत्ता तज्ञांनी तयार केलेले लेख.",
  }
};

const TEXT_IDS = [
  'headerCta', 'heroBadge', 'heroSub', 'pill1', 'pill2', 'pill3', 'pill4',
  'calcTitle', 'labelArea', 'areaPlaceholder', 'labelDeed',
  'optDeedSale', 'optDeedGiftRel', 'optDeedGiftOther', 'optDeedPoa',
  'mvToggleTitle', 'labelValue', 'valueOptional', 'numWords', 'errValue', 'calcBtn',
  'resultLabel', 'breakdownTitle', 'brBaseStamp', 'brMetroCess', 'brLBT',
  'brTotalDuty', 'brRegFee', 'brTotal', 'brGenderRebate',
  'copyBtn', 'shareBtn', 'resetBtn', 'leadTitle', 'leadDesc',
  'labelGender', 'genderMale', 'genderFemale', 'genderJoint', 'genderRebateTag', 'genderRebateText',
];

const HTML_IDS = [
  'heroH1', 'mvToggleDesc', 'tooltipHtml', 'noteBox', 'footerLine1', 'footerLine2',
  'editorialHeading', 'editorialSub',
];

// Expose globally
window.MH_I18N = {
  T,
  TEXT_IDS,
  HTML_IDS
};


  // --- 3. CALCULATION ENGINE ---
/**
 * Maharashtra Stamp Duty Calculator - Core Business Logic Engine
 * Pure computation functions decoupled from DOM rendering.
 */

(function (window) {
  'use strict';

  /**
   * Computes comprehensive stamp duty and registration breakdown
   * @param {Object} params
   * @param {number} params.val - Higher of Agreement Value or Ready Reckoner
   * @param {string} params.area - Selected area key
   * @param {string} params.gender - 'male' | 'female' | 'joint'
   * @param {string} params.zone - 'urban' | 'mun_council' | 'rural'
   * @param {string} params.deed - 'sale' | 'gift_relative' | 'gift_other' | 'poa'
   * @returns {Object} Computed results breakdown
   */
  function computeStampDuty(params) {
    const { val, area, gender, zone, deed } = params;

    const ratesConfig = window.MH_RATES || {};
    const DEED = ratesConfig.DEED;
    const getRates = ratesConfig.getRates;

    const cfg = DEED[deed] || DEED.sale;
    const isPOA = (deed === 'poa');
    const isGiftR = (deed === 'gift_relative');
    const isStd = (!isPOA && !isGiftR);

    const rates = getRates(area, gender, zone);
    const totalRate = rates.base + rates.metro + rates.lbt;
    const effectiveRate = totalRate;

    // Computed duty components
    const baseDutyAmt = isStd ? Math.ceil(val * rates.base) : 0;
    const metroAmt    = isStd ? Math.ceil(val * rates.metro) : 0;
    const lbtAmt      = isStd ? Math.ceil(val * rates.lbt) : 0;

    const rawDuty = cfg.stampFn(val, rates);
    const reg     = cfg.regFn(val);
    const total   = rawDuty + reg;

    // Rebate calculations: Sole female owners receive 1% rebate on base duty
    const showRebateRow = (gender === 'female') && isStd && !isPOA;
    const rebateAmt = showRebateRow ? Math.ceil(val * 0.01) : 0;

    // Region applicability flags
    const showMR  = isStd && rates.metro > 0;
    const showLBT = isStd && rates.lbt > 0;
    const isMMR   = (area === 'navi-mumbai' || area === 'thane' || area === 'mumbai-city' || area === 'mumbai-suburban');

    return {
      val,
      area,
      gender,
      zone,
      deed,
      regLabel: cfg.regLabel,
      rates,
      totalRate,
      effectiveRate,
      baseDutyAmt,
      metroAmt,
      lbtAmt,
      rawDuty,
      reg,
      total,
      rebateAmt,
      showRebateRow,
      showMR,
      showLBT,
      isPOA,
      isGiftR,
      isStd,
      isMMR
    };
  }

  // Expose module
  window.MH_CALCULATOR = {
    computeStampDuty
  };
})(window);


  // --- 4. UI CONTROLLER & APP BOOTSTRAP (BROWSER ONLY) ---
  if (typeof document !== 'undefined') {
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

  }

  return {
    MH_CALCULATOR: window.MH_CALCULATOR,
    MH_RATES: window.MH_RATES
  };
});
