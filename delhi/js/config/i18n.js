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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DELHI_I18N };
} else {
  window.DELHI_I18N = DELHI_I18N;
}
