/**
 * West Bengal Stamp Duty & Registration Calculator — Unified Vanilla JS Module
 * Self-contained: includes statutory rates, bilingual i18n, calculation engine, UI controller, and bootstrap.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js
    global.window = global.window || global;
    module.exports = factory(global.window);
  } else {
    // Browser globals
    factory(root);
  }
})(typeof self !== 'undefined' ? self : this, function (window) {
  'use strict';

  // --- 1. RATES DATA ---
  const WB_RATES = {
    BASE_DUTY: { urban: 0.06, rural: 0.05 },
    SURCHARGE: { threshold: 10000000, rate: 0.01 },
    GENDER_REBATE: { female: 0.01, joint: 0.01, male: 0.00 },
    REGISTRATION_FEE: { standardRate: 0.011, poaFlat: 200 },
    DEEDS: {
      sale: { isStandard: true, dutyType: 'percentage', regType: 'percentage' },
      gift_relative: { isStandard: false, flatDutyRate: 0.005, exemptFromSurcharge: true, exemptFromGenderRebate: true, regType: 'percentage' },
      gift_other: { isStandard: true, dutyType: 'percentage', regType: 'percentage' },
      poa: { isStandard: false, flatDutyAmount: 1000, flatRegAmount: 200, exemptFromSurcharge: true, exemptFromGenderRebate: true }
    }
  };
  window.WB_RATES = WB_RATES;
  window.WB_RATES_MODULE = { WB_RATES };

  // --- 2. I18N STRINGS ---
/**
 * West Bengal Stamp Duty Calculator - Bilingual i18n Strings (English & Bengali)
 */

(function (exports) {
  'use strict';

  const T = {
    en: {
      headerCta: "Calculate Now ↓",
      heroBadge: "West Bengal · 2025-2026 · Current Rates",
      heroH1: 'Calculate <em>Stamp Duty</em><br>&amp; Registration in WB',
      heroSub: "Instant, accurate calculations for all areas — Kolkata, New Town, Salt Lake, Rajarhat &amp; more.",
      pill1: "✓ Urban & Rural Rates", pill2: "✓ Surcharge on ₹1Cr+", pill3: "✓ Registration 1.1%", pill4: "✓ Free Forever",
      calcTitle: "West Bengal Property Calculator",
      btnUrban: "🏙️ Urban / Municipal", btnRural: "🌾 Rural / Panchayat",
      labelArea: "Area / Locality", areaPlaceholder: "— Select Area —",
      ogKolkata: "Kolkata Metro", ogNorth: "North & East Kolkata", ogSouth: "South Kolkata",
      labelDeed: "Deed Type",
      optDeedSale: "Sale / Transfer Deed", optDeedGiftRel: "Gift Deed — Blood Relative",
      optDeedGiftOther: "Gift Deed — Non-Relative", optDeedPoa: "Power of Attorney (General)",
      mvToggleTitle: "Using Agreement Value (lower than Market Value)?",
      mvToggleDesc: "Stamp duty is always on the <b>higher</b> of Market Value or Agreement Value. Tap to learn why this matters.",
      mvInfoBox: `<ul><li><strong>Market Value</strong> = Government-assessed circle rate (minimum floor price).</li><li><strong>Agreement Value</strong> = What you actually agreed to pay the seller.</li><li>West Bengal IGR calculates stamp duty on the <strong>higher of the two</strong>.</li><li>If your deal is ₹40L but circle rate is ₹55L → stamp duty is on <strong>₹55L</strong>.</li><li>Always enter the <strong>Market Value / Circle Rate</strong> below for accurate duty.</li></ul>`,
      labelValue: "Market Value", valueOptional: "(use circle rate or higher)",
      tooltipHtml: "<b>Circle Rate = Government's minimum price.</b><br>If your deal is ₹40L but the circle rate is ₹55L, enter <b>₹55L</b> — stamp duty is always on the higher value. Find your circle rate at wbregistration.gov.in",
      numWordsDefault: 'e.g. type 7500000 for "Seventy-Five Lakhs"',
      errValue: "Please enter a valid property value.",
      calcBtn: "⚡ Calculate Stamp Duty & Registration",
      resultLabel: "Total Government Charges", breakdownTitle: "Detailed Breakdown",
      brBaseStamp: "Base Stamp Duty", brSurcharge: "Surcharge (>₹1 Cr)",
      brTotalDuty: "Total Stamp Duty", brRegFee: "Registration Fee", brTotal: "Total Payable",
      noteBox: "<b>Note:</b> This is an estimate based on 2026 WB Stamp Act rates. Final amount may vary based on IGR Bengal's registered circle rates, property category (residential/commercial), and applicable exemptions. Always verify with a registered document writer or IGR office.",
      copyBtn: "📋 Copy Result", shareBtn: "↗ Share", resetBtn: "↩ New Calc",
      leadTitle: "Need a Free Property Valuation?",
      leadDesc: "Talk to a registered valuer for your area. Circle rates, fair market value &amp; registration guidance — free consultation.",
      acc1Title: "📊 West Bengal Stamp Duty Rates 2026",
      acc2Title: "🏙️ Area-wise Market Value Guide",
      acc3Title: "❓ How is Stamp Duty calculated in WB?",
      acc4Title: "💰 Can I save on Stamp Duty in West Bengal?",
      acc1Note: "Registration fee is calculated on Market Value. The 1% surcharge applies on stamp duty only when property value exceeds ₹1 Crore.",
      acc2Note: "⚠️ <b>Note on Surcharge:</b> Even in Rural areas, properties above ₹1 Crore attract 5% + 1% surcharge = <b>6% effective stamp duty</b>. The surcharge applies to stamp duty only — Registration Fee (1.1%) is unaffected.",
      acc3Html: `<p><b>Step 1:</b> Determine if your property is in a Municipal (Urban) or Panchayat (Rural) area.</p><p style="margin-top:0.5rem;"><b>Step 2:</b> Identify the higher of Market Value and Agreement Value. Stamp duty is always charged on the higher figure.</p><p style="margin-top:0.5rem;"><b>Step 3:</b> Apply base rate — 6% (Urban) or 5% (Rural). Add 1% surcharge if value exceeds ₹1 Crore.</p><p style="margin-top:0.5rem;"><b>Step 4:</b> Add Registration Fee of 1.1% of Market Value.</p><p style="margin-top:0.5rem;"><b>Step 5:</b> Total = Stamp Duty + Registration Fee. This is paid at the Sub-Registrar's office or via eStamp.</p><div class="mutation-callout"><div class="mc-head">📌 After Registration: Don't Forget Mutation <span class="mc-badge">Important</span></div><p>Registration transfers legal ownership — but your name won't appear in government land records until you complete <b>Mutation (নামজারি)</b>. This is a separate process:</p><ul style="padding-left:1.1rem;margin-top:0.4rem;"><li style="margin-bottom:0.25rem;"><b>Rural / Panchayat land:</b> Apply at the <b>BL&amp;LRO</b> (Block Land &amp; Land Reforms Office).</li><li style="margin-bottom:0.25rem;"><b>Urban / Municipal property:</b> Apply at your local <b>Municipality / Corporation</b>.</li><li style="margin-bottom:0.25rem;">Mutation is required for property tax records, future resale, and home loan purposes.</li><li>Skipping mutation can cause legal and financial complications for the new owner.</li></ul></div>`,
      acc4Html: `<p><b>Rebates available:</b></p><ul style="padding-left:1.1rem;margin-top:0.4rem;"><li style="margin-bottom:0.3rem;"><b>Women buyers:</b> Some municipalities offer reduced duty for properties in a woman's name.</li><li style="margin-bottom:0.3rem;"><b>First-time homebuyers:</b> Check state housing scheme notifications for applicable rebates.</li><li style="margin-bottom:0.3rem;"><b>Gifted property:</b> Stamp duty is lower for gifts between blood relatives.</li><li style="margin-bottom:0.3rem;"><b>eStamp:</b> No additional fee over standard rates.</li></ul><p style="margin-top:0.6rem;">Always consult a licensed document writer registered with IGR Bengal for exemption eligibility.</p>`,
      footerLine1: 'Rates as per <b>West Bengal Stamp (Amendment) Act, 2025-2026</b>. For official circle rates, visit <a href="https://wbregistration.gov.in" target="_blank" rel="noopener">wbregistration.gov.in</a>',
      footerLine2: '© 2026 StampDutyCalc.in · <a href="/privacy-policy.html">Privacy</a> · <a href="/disclaimer.html">Disclaimer</a> · Not legal advice',
      zoneUrban: "Urban (Municipal)", zoneRural: "Rural (Panchayat)",
      numCrore: "Crore", numLakh: "Lakh", numThousand: "Thousand", numPrefix: "= ₹ ",
      deedLabel: { sale: "Sale Deed", gift_relative: "Gift Deed (Blood Relative)", gift_other: "Gift Deed (Non-Relative)", poa: "Power of Attorney (General)" },
      deedNote: {
        sale: null,
        gift_relative: "⚠️ Gift to blood relative: Stamp duty is 0.5% (flat) — no surcharge applies regardless of value. Registration fee remains 1.1%. Eligible relatives: spouse, parent, child, sibling, grandchild.",
        gift_other: "📋 Gift to non-relative: Standard stamp duty rates apply — same as Sale Deed.",
        poa: "📋 General POA: stamp duty ₹1,000 flat + ₹200 registration flat. Property value is for reference only."
      },
      labelGender: 'Buyer Type',
      genderMale: 'Male', genderFemale: 'Female', genderJoint: 'Joint',
      genderRebateTag: '−1%',
      genderRebateText: 'Women buyers receive a 1% stamp duty rebate in West Bengal — Urban rate: 5% (instead of 6%), Rural rate: 4% (instead of 5%). Applies to Sale Deeds and non-relative Gift Deeds. Joint ownership: rebate applies when the primary buyer is female.',
      brGenderRebate: 'Women Buyer Rebate (−1%)',
      floatCalcBtn: "⚡ Calculate",
      copyHeader: "West Bengal Stamp Duty Estimate (StampDutyCalc.in)",
      lDeed: "Deed Type", lVal: "Property Value", lZone: "Zone", lDuty: "Stamp Duty", lReg: "Registration Fee", lTotal: "TOTAL",
      copied: "✓ Copied!", copyFail: "Copy not supported. Please select and copy manually.",
      shareText: (val, words, total, deed, zone) => `Stamp Duty on ${val} (${words}) in WB = ${total} · ${deed} · ${zone}. StampDutyCalc.in`,
      editorialHeading: 'West Bengal Property Registration — Guides &amp; Resources',
      editorialSub: 'In-depth articles curated by West Bengal property professionals to help you navigate stamp duty, IGR portal, and registration with confidence.',
      guideNum1: 'Guide 01', guideNum2: 'Guide 02', guideNum3: 'Guide 03',
      guideTitle1: 'Understanding Circle Rates in West Bengal: A 2025-2026 Perspective',
      guideTitle2: 'Step-by-Step Guide to the IGR West Bengal Portal (wbregistration.gov.in)',
      guideTitle3: 'Common Mistakes to Avoid During Property Registration in Kolkata',
      acc5Title: "📋 Comprehensive Document Checklist",
      acc5Html: `<div class="checklist-wrap"><div class="cl-section"><div class="cl-section-head"><span>1 — Identity &amp; KYC</span><span class="cl-section-note">Buyer · Seller · Witnesses</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>Aadhaar Card:</b> Original + 2 self-attested photocopies per party. Crucial for biometric verification at the ADSR office.</span></li><li><span class="cl-box"></span><span><b>PAN Card:</b> Original + 2 copies. Mandatory for transactions above ₹5 Lakhs.</span></li><li><span class="cl-box"></span><span><b>Passport Photos:</b> 3 recent colour photos (white background) for each party.</span></li><li><span class="cl-box"></span><span><b>Witnesses:</b> Two adults with their own Aadhaar &amp; PAN cards.</span></li><li><span class="cl-box"></span><span><b>Power of Attorney (if applicable):</b> Original registered POA if signing on behalf of a party.</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>2 — The Property "Paper Trail"</span><span class="cl-section-note">Verify before deed drafting</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>Mother Deed (দলিল):</b> Copies of ownership documents for the last 30 years.</span></li><li><span class="cl-box"></span><span><b>Record of Rights — Parcha / Khatian (খতিয়ান):</b> Verified status from the Banglarbhumi portal.</span></li><li><span class="cl-box"></span><span><b>Mutation Certificate (নামজারি):</b> Confirms the Seller is the current recorded owner in Govt. records.</span></li><li><span class="cl-box"></span><span><b>Latest Property Tax Receipt:</b> Up-to-date KMC / Municipality / Panchayat tax paid receipt.</span></li><li><span class="cl-box"></span><span><b>Land Conversion Certificate:</b> Required if land was converted (e.g., Sali to Bastu).</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>3 — Apartments &amp; Projects</span><span class="cl-section-note">Flats &amp; gated communities only</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>Sanctioned Building Plan:</b> Approved by KMC / HIDCO / NKDA or local Municipality.</span></li><li><span class="cl-box"></span><span><b>Completion / Occupancy Certificate (CC/OC):</b> Required if the building is complete.</span></li><li><span class="cl-box"></span><span><b>WBHIRA / WBRERA Registration:</b> Confirm the project is registered with the state housing authority.</span></li><li><span class="cl-box"></span><span><b>NOC from Society / Association:</b> If applicable — obtain before deed drafting.</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>4 — Financial Compliance &amp; Govt. Dues</span><span class="cl-section-note">All paid via GRIPS portal</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>E-Assessment Slip:</b> Query Number generated from wbregistration.gov.in portal.</span></li><li><span class="cl-box"></span><span><b>Stamp Duty Payment Receipt:</b> Generated via the GRIPS portal after payment.</span></li><li><span class="cl-box"></span><span><b>Registration Fee Receipt:</b> Also generated via the GRIPS portal.</span></li><li><span class="cl-box"></span><span><b>TDS Receipt — Form 26QB:</b> Mandatory 1% TDS proof if property value is ₹50 Lakhs or more.</span></li></ul></div></div><div class="cl-dl-strip" style="margin-top:0.85rem;"><div class="cl-dl-icon">📄</div><div class="cl-dl-text"><strong>The 2026 WB Property Registration Checklist (PDF)</strong><p>Printable version with all 5 sections, Day-of-Registration guide &amp; Mutation reminder.</p></div><a href="#" class="cl-dl-btn">⬇ Get PDF</a></div>`,
      hidcoAccTitle: '🏛️ New Town (Rajarhat) HIDCO/NKDA Transfer Fees &amp; Leasehold Rules',
      hidcoWarningHead: '⚠️ New Town Buyers — Read This Before Signing.',
      hidcoWhyDiff: '<strong>Why is this different?</strong> WBHIDCO (West Bengal Housing Infrastructure Development Corporation) originally allotted New Town plots on a <strong>99-year leasehold</strong> basis. Every time a leasehold property changes hands, both HIDCO and NKDA have approval and fee roles that sit <em>on top of</em> standard stamp duty and registration.',
      hidcoThCharge: 'Charge', hidcoThTo: 'Payable To', hidcoThWhen: 'When Due', hidcoThAmt: 'Amount',
      hidcoLeaseholdNote: '<strong>🔄 Leasehold-to-Freehold Conversion (January 2023 Scheme):</strong> The WB Government launched a one-time conversion scheme. Apply at <strong>leaseholdtofreeholdwb.com</strong> — this portal is part of the WB e-District ecosystem; existing WB e-District login credentials work here too.',
      hidcoChecklistHead: '<strong>✅ Buyer\'s Checklist for New Town Properties:</strong>',
      hidcoChecklistUl: `<li>Verify whether the property is <b>already freehold</b> (if converted, no HIDCO NOC is required)</li><li>Confirm <b>no dues are outstanding to HIDCO</b> before paying any token amount</li><li>Obtain the HIDCO NOC <em>before</em> visiting the Sub-Registrar's office</li><li>Pay the <b>NKDA Transfer Fee</b> after registration</li><li>Complete <b>Mutation (নামজারি) at NKDA</b> for properties within New Town limits — not at the BL&amp;LRO</li>`,
      newTownAATitle: '📍 Circle Rate Guide — New Town (Rajarhat) 2025-2026 <span class="mc-badge">High-Demand Zone</span>',
      newTownAAList: `<li style="margin-bottom:0.25rem;"><b>Action Area I (AA-I)</b> — DLF, Unitech, Eco Space corridor: ₹5,500–₹9,500/sq.ft — Premium zone, highest circle rates in New Town.</li><li style="margin-bottom:0.25rem;"><b>Action Area II (AA-II)</b> — Biswa Bangla Gate, Tata Cancer Hospital area: ₹4,800–₹8,200/sq.ft.</li><li style="margin-bottom:0.25rem;"><b>Action Area III (AA-III)</b> — Airport-adjacent zones: ₹3,500–₹6,500/sq.ft.</li><li><b>HIDCO Leasehold Plots:</b> Rates vary by mouza — check wbregistration.gov.in for the specific mouza name.</li>`,
      newTownAAStampNote: 'Stamp duty on New Town properties is <b>6% (Urban)</b>. Above ₹1 Crore a <b>1% surcharge</b> applies, making the effective stamp duty <b>7%</b>. Always enter the IGR Circle Rate for your specific Action Area (AA) on the IGR portal for an accurate figure.'
    },

    bn: {
      headerCta: "এখনই হিসাব করুন ↓",
      heroBadge: "পশ্চিমবঙ্গ · ২০২৫-২০২৬ · বর্তমান রেট",
      heroH1: 'পশ্চিমবঙ্গে <em>স্ট্যাম্প ডিউটি</em><br>ও রেজিস্ট্রেশন হিসাব করুন',
      heroSub: "তাৎক্ষণিক ও নির্ভুল হিসাব — কলকাতা, নিউ টাউন, সল্টলেক, রাজারহাট সহ সব এলাকার জন্য।",
      pill1: "✓ শহর ও গ্রামের রেট", pill2: "✓ ₹১ কোটির বেশিতে সারচার্জ", pill3: "✓ রেজিস্ট্রেশন ১.১%", pill4: "✓ সম্পূর্ণ বিনামূল্যে",
      calcTitle: "পশ্চিমবঙ্গ সম্পত্তি ক্যালকুলেটর",
      btnUrban: "🏙️ শহর / পৌরসভা", btnRural: "🌾 গ্রামীণ / পঞ্চায়েত",
      labelArea: "এলাকা / অঞ্চল", areaPlaceholder: "— এলাকা বেছে নিন —",
      ogKolkata: "কলকাতা মেট্রো", ogNorth: "উত্তর ও পূর্ব কলকাতা", ogSouth: "দক্ষিণ কলকাতা",
      labelDeed: "দলিলের ধরন",
      optDeedSale: "বিক্রয় / হস্তান্তর দলিল", optDeedGiftRel: "দান দলিল — নিকট আত্মীয়",
      optDeedGiftOther: "দান দলিল — অনাত্মীয়", optDeedPoa: "পাওয়ার অফ অ্যাটর্নি (সাধারণ)",
      mvToggleTitle: "চুক্তি মূল্য (বাজার মূল্যের চেয়ে কম) ব্যবহার করছেন?",
      mvToggleDesc: "স্ট্যাম্প ডিউটি সবসময় বাজার মূল্য বা চুক্তি মূল্যের মধ্যে <b>যেটি বেশি</b> তার উপর ধার্য হয়। কেন এটি গুরুত্বপূর্ণ জানতে ট্যাপ করুন।",
      mvInfoBox: `<ul><li><strong>বাজার মূল্য</strong> = সরকার নির্ধারিত সার্কেল রেট (ন্যূনতম মূল্য সীমা)।</li><li><strong>চুক্তি মূল্য</strong> = বিক্রেতার সাথে আপনার সম্মত মূল্য।</li><li>পশ্চিমবঙ্গ IGR সর্বদা <strong>দুটির মধ্যে যেটি বেশি</strong> তার উপর স্ট্যাম্প ডিউটি গণনা করে।</li><li>চুক্তি ₹৪০ লক্ষ কিন্তু সার্কেল রেট ₹৫৫ লক্ষ → স্ট্যাম্প ডিউটি <strong>₹৫৫ লক্ষের উপর</strong>।</li><li>সঠিক হিসাবের জন্য নিচে <strong>বাজার মূল্য / সার্কেল রেট</strong> লিখুন।</li></ul>`,
      labelValue: "বাজার মূল্য", valueOptional: "(সার্কেল রেট বা বেশি লিখুন)",
      tooltipHtml: "<b>সার্কেল রেট = সরকারের নির্ধারিত ন্যূনতম মূল্য।</b><br>চুক্তি ₹৪০ লক্ষ হলেও সার্কেল রেট ₹৫৫ লক্ষ হলে <b>₹৫৫ লক্ষ</b> লিখুন। wbregistration.gov.in-এ সার্কেল রেট দেখুন।",
      numWordsDefault: 'যেমন: ৭৫০০০০০ লিখলে দেখাবে "৭৫ লক্ষ"',
      errValue: "সঠিক সম্পত্তি মূল্য লিখুন।",
      calcBtn: "⚡ স্ট্যাম্প ডিউটি ও রেজিস্ট্রেশন হিসাব করুন",
      resultLabel: "মোট সরকারি চার্জ", breakdownTitle: "বিস্তারিত হিসাব",
      brBaseStamp: "মূল স্ট্যাম্প ডিউটি", brSurcharge: "সারচার্জ (>₹১ কোটি)",
      brTotalDuty: "মোট স্ট্যাম্প ডিউটি", brRegFee: "রেজিস্ট্রেশন ফি", brTotal: "মোট প্রদেয়",
      noteBox: "<b>নোট:</b> এটি ২০২৬ সালের পশ্চিমবঙ্গ স্ট্যাম্প আইনের রেট অনুযায়ী একটি আনুমানিক হিসাব। চূড়ান্ত পরিমাণ IGR বেঙ্গলের সার্কেল রেট, সম্পত্তির শ্রেণি এবং প্রযোজ্য ছাড়ের উপর নির্ভর করে পরিবর্তিত হতে পারে। নিবন্ধিত দলিল লেখক বা IGR অফিসে যাচাই করুন।",
      copyBtn: "📋 ফলাফল কপি করুন", shareBtn: "↗ শেয়ার করুন", resetBtn: "↩ নতুন হিসাব",
      leadTitle: "বিনামূল্যে সম্পত্তি মূল্যায়ন চান?",
      leadDesc: "নিবন্ধিত মূল্যায়নকারীর সাথে কথা বলুন। সার্কেল রেট, বাজার মূল্য ও রেজিস্ট্রেশন সহায়তা — বিনামূল্যে পরামর্শ।",
      acc1Title: "📊 পশ্চিমবঙ্গ স্ট্যাম্প ডিউটি রেট ২০২৬",
      acc2Title: "🏙️ এলাকাভিত্তিক বাজার মূল্য গাইড",
      acc3Title: "❓ পশ্চিমবঙ্গে স্ট্যাম্প ডিউটি কীভাবে হিসাব হয়?",
      acc4Title: "💰 পশ্চিমবঙ্গে কি স্ট্যাম্প ডিউটি বাঁচানো সম্ভব?",
      acc1Note: "রেজিস্ট্রেশন ফি বাজার মূল্যের উপর নির্ধারিত হয়। সম্পত্তির মূল্য ₹১ কোটি ছাড়ালে শুধুমাত্র স্ট্যাম্প ডিউটির উপর ১% সারচার্জ প্রযোজ্য।",
      acc2Note: "⚠️ <b>সারচার্জ প্রসঙ্গে:</b> গ্রামীণ এলাকায়ও ₹১ কোটির বেশি সম্পত্তিতে ৫% + ১% সারচার্জ = <b>মোট ৬% স্ট্যাম্প ডিউটি</b>। সারচার্জ শুধু স্ট্যাম্প ডিউটিতে — রেজিস্ট্রেশন ফি (১.১%) অপরিবর্তিত।",
      acc3Html: `<p><b>ধাপ ১:</b> আপনার সম্পত্তি পৌরসভা (শহর) নাকি পঞ্চায়েত (গ্রামীণ) এলাকায় তা নির্ধারণ করুন।</p><p style="margin-top:0.5rem;"><b>ধাপ ২:</b> বাজার মূল্য ও চুক্তি মূল্যের মধ্যে যেটি বেশি তা চিহ্নিত করুন।</p><p style="margin-top:0.5rem;"><b>ধাপ ৩:</b> মূল হার — ৬% (শহর) বা ৫% (গ্রামীণ)। মূল্য ₹১ কোটি ছাড়ালে অতিরিক্ত ১% সারচার্জ।</p><p style="margin-top:0.5rem;"><b>ধাপ ৪:</b> বাজার মূল্যের ১.১% রেজিস্ট্রেশন ফি যোগ করুন।</p><p style="margin-top:0.5rem;"><b>ধাপ ৫:</b> মোট = স্ট্যাম্প ডিউটি + রেজিস্ট্রেশন ফি। সাব-রেজিস্ট্রার অফিসে বা ই-স্ট্যাম্পের মাধ্যমে পরিশোধ করুন।</p><div class="mutation-callout"><div class="mc-head">📌 রেজিস্ট্রেশনের পর: মিউটেশন (নামজারি) ভুলবেন না <span class="mc-badge">জরুরি</span></div><p>রেজিস্ট্রেশন আইনি মালিকানা হস্তান্তর করে — কিন্তু মিউটেশন না হওয়া পর্যন্ত সরকারি রেকর্ডে আপনার নাম উঠবে না।</p><ul style="padding-left:1.1rem;margin-top:0.4rem;"><li style="margin-bottom:0.25rem;"><b>গ্রামীণ / পঞ্চায়েত জমি:</b> <b>BL&amp;LRO অফিসে</b> (ব্লক ভূমি ও ভূমি সংস্কার অফিস) আবেদন করুন।</li><li style="margin-bottom:0.25rem;"><b>শহর / পৌরসভা সম্পত্তি:</b> স্থানীয় <b>পৌরসভা / কর্পোরেশনে</b> আবেদন করুন।</li><li style="margin-bottom:0.25rem;">সম্পত্তি কর, ভবিষ্যৎ বিক্রয় ও হোম লোনের জন্য মিউটেশন আবশ্যক।</li><li>মিউটেশন না করলে নতুন মালিকের আইনি ও আর্থিক জটিলতা হতে পারে।</li></ul></div>`,
      acc4Html: `<p><b>উপলব্ধ ছাড়:</b></p><ul style="padding-left:1.1rem;margin-top:0.4rem;"><li style="margin-bottom:0.3rem;"><b>মহিলা ক্রেতা:</b> কিছু পৌরসভায় মহিলার নামে নিবন্ধিত সম্পত্তিতে হ্রাসকৃত হার।</li><li style="margin-bottom:0.3rem;"><b>প্রথমবার ক্রেতা:</b> রাজ্য আবাসন প্রকল্পের বিজ্ঞপ্তি দেখুন।</li><li style="margin-bottom:0.3rem;"><b>উপহার সম্পত্তি:</b> নিকট আত্মীয়দের মধ্যে দানে স্ট্যাম্প ডিউটি কম।</li><li style="margin-bottom:0.3rem;"><b>ই-স্ট্যাম্প:</b> স্বাভাবিক হারের বাইরে কোনো অতিরিক্ত ফি নেই।</li></ul><p style="margin-top:0.6rem;">ছাড়ের যোগ্যতার জন্য IGR বেঙ্গলে নিবন্ধিত দলিল লেখকের পরামর্শ নিন।</p>`,
      footerLine1: 'রেট <b>পশ্চিমবঙ্গ স্ট্যাম্প (সংশোধনী) আইন, ২০২৬</b> অনুযায়ী। সরকারি সার্কেল রেটের জন্য দেখুন <a href="https://wbregistration.gov.in" target="_blank" rel="noopener">wbregistration.gov.in</a>',
      footerLine2: '© ২০২৬ StampDutyCalc.in · <a href="/privacy-policy.html">গোপনীয়তা</a> · <a href="/disclaimer.html">দায়বদ্ধতা</a> · আইনি পরামর্শ নয়',
      zoneUrban: "শহর (পৌরসভা)", zoneRural: "গ্রামীণ (পঞ্চায়েত)",
      numCrore: "কোটি", numLakh: "লক্ষ", numThousand: "হাজার", numPrefix: "= ₹ ",
      deedLabel: { sale: "বিক্রয় দলিল", gift_relative: "দান দলিল (নিকট আত্মীয়)", gift_other: "দান দলিল (অনাত্মীয়)", poa: "পাওয়ার অফ অ্যাটর্নি (সাধারণ)" },
      deedNote: {
        sale: null,
        gift_relative: "⚠️ নিকট আত্মীয়কে দান: স্ট্যাম্প ডিউটি ০.৫% (নির্দিষ্ট) — কোনো সারচার্জ প্রযোজ্য নয়। রেজিস্ট্রেশন ফি ১.১%। যোগ্য আত্মীয়: স্বামী/স্ত্রী, পিতা-মাতা, সন্তান, ভাই-বোন, নাতি-নাতনি।",
        gift_other: "📋 অনাত্মীয়কে দান: সাধারণ বিক্রয় দলিলের সমান স্ট্যাম্প ডিউটি রেট প্রযোজ্য।",
        poa: "📋 সাধারণ POA: স্ট্যাম্প ডিউটি ₹১,০০০ নির্দিষ্ট + রেজিস্ট্রেশন ₹২০০ নির্দিষ্ট। সম্পত্তির মূল্য শুধুমাত্র রেফারেন্সের জন্য।"
      },
      labelGender: 'ক্রেতার ধরন',
      genderMale: 'পুরুষ', genderFemale: 'মহিলা', genderJoint: 'যৌথ',
      genderRebateTag: '−১%',
      genderRebateText: 'পশ্চিমবঙ্গে মহিলা ক্রেতারা স্ট্যাম্প ডিউটিতে ১% ছাড় পান — শহরের হার: ৫% (৬%-এর পরিবর্তে), গ্রামীণ হার: ৪% (৫%-এর পরিবর্তে)। বিক্রয় দলিল ও অনাত্মীয় দান দলিলে প্রযোজ্য। যৌথ মালিকানা: প্রধান ক্রেতা মহিলা হলে ছাড় প্রযোজ্য।',
      brGenderRebate: 'মহিলা ক্রেতা ছাড় (−১%)',
      floatCalcBtn: "⚡ হিসাব করুন",
      copyHeader: "পশ্চিমবঙ্গ স্ট্যাম্প ডিউটি আনুমানিক হিসাব (StampDutyCalc.in)",
      lDeed: "দলিলের ধরন", lVal: "সম্পত্তির মূল্য", lZone: "এলাকা", lDuty: "স্ট্যাম্প ডিউটি", lReg: "রেজিস্ট্রেশন ফি", lTotal: "মোট প্রদেয়",
      copied: "✓ কপি হয়েছে!", copyFail: "কপি সমর্থিত নয়। অনুগ্রহ করে ম্যানুয়ালি কপি করুন।",
      shareText: (val, words, total, deed, zone) => `পশ্চিমবঙ্গে ${val} (${words}) সম্পত্তিতে স্ট্যাম্প ডিউটি = ${total} · ${deed} · ${zone}। StampDutyCalc.in`,
      editorialHeading: 'পশ্চিমবঙ্গ সম্পত্তি রেজিস্ট্রেশন — গাইড ও তথ্য',
      editorialSub: 'পশ্চিমবঙ্গের প্রোপার্টি বিশেষজ্ঞদের দ্বারা তৈরি নির্দেশিকা, যা আপনাকে স্ট্যাম্প ডিউটি ও আইজিআর পোর্টাল ব্যবহারে সাহায্য করবে।',
      guideNum1: 'গাইড ০১', guideNum2: 'গাইড ০২', guideNum3: 'গাইড ০৩',
      guideTitle1: 'পশ্চিমবঙ্গে সার্কেল রেট ২০২৫-২০২৬: বিস্তারিত তথ্য',
      guideTitle2: 'IGR পশ্চিমবঙ্গ পোর্টাল (wbregistration.gov.in) ব্যবহারের নির্দেশিকা',
      guideTitle3: 'কলকাতায় সম্পত্তি রেজিস্ট্রেশনের সময় যেসব ভুল এড়িয়ে চলবেন',
      acc5Title: "📋 প্রয়োজনীয় নথিপত্রের চেকলিস্ট",
      acc5Html: `<div class="checklist-wrap"><div class="cl-section"><div class="cl-section-head"><span>১ — পরিচয়পত্র ও কেওয়াইসি (KYC)</span><span class="cl-section-note">ক্রেতা · বিক্রেতা · সাক্ষী</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>আধার কার্ড:</b> মূল কপি + প্রতি পক্ষের ২ কপি সেলফ-অ্যাটেস্টেড জেরক্স। ADSR অফিসে বায়োমেট্রিকের জন্য জরুরি।</span></li><li><span class="cl-box"></span><span><b>প্যান কার্ড:</b> মূল কপি + ২ কপি জেরক্স। ₹৫ লক্ষের বেশি লেনদেনে বাধ্যতামূলক।</span></li><li><span class="cl-box"></span><span><b>পাসপোর্ট ছবি:</b> প্রতি পক্ষের ৩ কপি সাম্প্রতিক রঙিন ছবি (সাদা ব্যাকগ্রাউন্ড)।</span></li><li><span class="cl-box"></span><span><b>সাক্ষী:</b> নিজস্ব আধার ও প্যান কার্ড সহ দুজন প্রাপ্তবয়স্ক সাক্ষী।</span></li><li><span class="cl-box"></span><span><b>পাওয়ার অফ অ্যাটর্নি (প্রযোজ্য ক্ষেত্রে):</b> মূল রেজিস্টার্ড পিওএ।</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>২ — সম্পত্তির মালিকানা নথি</span><span class="cl-section-note">দলিল লেখার আগে যাচাই করুন</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>মাদার দলিল:</b> বিগত ৩০ বছরের ধারাবাহিক মালিকানার দলিলের কপি।</span></li><li><span class="cl-box"></span><span><b>খতিয়ান / পর্চা:</b> বাংলারভূমি পোর্টাল থেকে যাচাইকৃত রেকর্ড।</span></li><li><span class="cl-box"></span><span><b>মিউটেশন সার্টিফিকেট:</b> বিক্রেতা সরকারি রেকর্ডে বর্তমান মালিক হিসেবে নথিভুক্ত আছেন কি না।</span></li><li><span class="cl-box"></span><span><b>হালনাগাদ ট্যাক্স রসিদ:</b> পুরসভা বা পঞ্চায়েতের আপ-টু-ডেট ট্যাক্স পেমেন্ট রসিদ।</span></li><li><span class="cl-box"></span><span><b>জমি রূপান্তর সার্টিফিকেট:</b> কৃষিজমি বাস্তুতে রূপান্তরের প্রমাণপত্র (যদি প্রযোজ্য হয়)।</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>৩ — ফ্ল্যাট ও আবাসন সংক্রান্ত নথি</span><span class="cl-section-note">শুধুমাত্র ফ্ল্যাট ও গেটেড কমিউনিটি</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>অনুমোদিত বিল্ডিং প্ল্যান:</b> KMC / HIDCO / NKDA বা পুরসভা কর্তৃক অনুমোদিত নকশা।</span></li><li><span class="cl-box"></span><span><b>কমপ্লিশন / অকুপ্যান্সি সার্টিফিকেট (CC/OC):</b> বাড়ি সম্পূর্ণ হলে প্রয়োজনীয়।</span></li><li><span class="cl-box"></span><span><b>WBHIRA / WBRERA রেজিস্ট্রেশন:</b> আবাসন কর্তৃপক্ষের নিবন্ধন নিশ্চিত করুন।</span></li><li><span class="cl-box"></span><span><b>সোসাইটি NOC:</b> প্রয়োজনে দলিল খসড়া করার আগে সংগ্রহ করুন।</span></li></ul></div><div class="cl-section"><div class="cl-section-head"><span>৪ — সরকারি ফি ও আর্থিক প্রমাণ</span><span class="cl-section-note">GRIPS পোর্টালের মাধ্যমে প্রদেয়</span></div><ul class="cl-list"><li><span class="cl-box"></span><span><b>ই-অ্যাসেসমেন্ট স্লিপ:</b> wbregistration.gov.in থেকে প্রাপ্ত কোয়েরি নম্বর।</span></li><li><span class="cl-box"></span><span><b>স্ট্যাম্প ডিউটি চালান:</b> GRIPS পোর্টাল থেকে প্রাপ্ত পেমেন্ট রসিদ।</span></li><li><span class="cl-box"></span><span><b>রেজিস্ট্রেশন ফি চালান:</b> GRIPS পোর্টালের পেমেন্ট রসিদ।</span></li><li><span class="cl-box"></span><span><b>TDS রসিদ (Form 26QB):</b> ₹৫০ লক্ষ বা তার বেশি মূল্যের ক্ষেত্রে ১% TDS জমার প্রমাণ।</span></li></ul></div></div><div class="cl-dl-strip" style="margin-top:0.85rem;"><div class="cl-dl-icon">📄</div><div class="cl-dl-text"><strong>২০২৬ সালের পশ্চিমবঙ্গ রেজিস্ট্রেশন চেকলিস্ট (PDF)</strong><p>সব ৫টি বিভাগ, রেজিস্ট্রেশনের দিনের নির্দেশিকা ও মিউটেশন রিমাইন্ডার সহ প্রিন্টযোগ্য কপি।</p></div><a href="#" class="cl-dl-btn">⬇ PDF ডাউনলোড</a></div>`,
      hidcoAccTitle: '🏛️ নিউ টাউন (রাজারহাট) HIDCO/NKDA ট্রান্সফার ফি ও লিজহোল্ড নিয়মাবলী',
      hidcoWarningHead: '⚠️ নিউ টাউনের ক্রেতাদের জন্য জরুরি তথ্য',
      hidcoWhyDiff: '<strong>কেন এটি ভিন্ন?</strong> WBHIDCO নিউ টাউনের প্লটগুলি মূলত <strong>৯৯ বছরের লিজহোল্ড</strong> ভিত্তিতে বরাদ্দ করেছিল। প্রতিবার লিজহোল্ড সম্পত্তি হাতবদল হলে স্ট্যাম্প ডিউটি ও রেজিস্ট্রেশনের পাশাপাশি HIDCO ও NKDA-এর অনুমোদন ও অতিরিক্ত ফি প্রযোজ্য হয়।',
      hidcoThCharge: 'চার্জের ধরন', hidcoThTo: 'প্রাপক', hidcoThWhen: 'কখন দিতে হয়', hidcoThAmt: 'পরিমাণ',
      hidcoLeaseholdNote: '<strong>🔄 লিজহোল্ড থেকে ফ্রিহোল্ড রূপান্তর (জানুয়ারি ২০২৩ স্কিম):</strong> পশ্চিমবঙ্গ সরকার এককালীন রূপান্তর প্রকল্প চালু করেছে। আবেদন করুন <strong>leaseholdtofreeholdwb.com</strong> পোর্টালে — বিদ্যমান WB e-District লগইন এখানে কার্যকর।',
      hidcoChecklistHead: '<strong>✅ নিউ টাউনে সম্পত্তি কেনার চেকলিস্ট:</strong>',
      hidcoChecklistUl: `<li>সম্পত্তিটি <b>ইতিমধ্যেই ফ্রিহোল্ড কি না</b> যাচাই করুন (ফ্রিহোল্ড হলে HIDCO NOC লাগে না)</li><li>টোকেন দেওয়ার আগে HIDCO-তে কোনো <b>বকেয়া পাওনা নেই</b> তা নিশ্চিত করুন</li><li>রেজিস্ট্রেশনের আগেই HIDCO থেকে প্রয়োজনীয় <b>NOC</b> সংগ্রহ করুন</li><li>রেজিস্ট্রেশন সম্পন্ন হওয়ার পর <b>NKDA ট্রান্সফার ফি</b> পরিশোধ করুন</li><li>নিউ টাউনের অভ্যন্তরে <b>মিউটেশন (নামজারি) NKDA অফিসে</b> করতে হয় — BL&amp;LRO অফিসে নয়</li>`,
      newTownAATitle: '📍 সার্কেল রেট গাইড — নিউ টাউন (রাজারহাট) ২০২৫-২০২৬ <span class="mc-badge">জনপ্রিয় অঞ্চল</span>',
      newTownAAList: `<li style="margin-bottom:0.25rem;"><b>অ্যাকশন এরিয়া ১ (AA-I)</b> — DLF, ইউনিটেক, ইকো স্পেস করিডোর: ₹৫,৫০০–₹৯,৫০০/বর্গফুট — নিউ টাউনের সর্বোচ্চ সার্কেল রেট।</li><li style="margin-bottom:0.25rem;"><b>অ্যাকশন এরিয়া ২ (AA-II)</b> — বিশ্ব বাংলা গেট, টাটা ক্যানসার হাসপাতাল এলাকা: ₹৪,৮০০–₹৮,২০০/বর্গফুট।</li><li style="margin-bottom:0.25rem;"><b>অ্যাকশন এরিয়া ৩ (AA-III)</b> — বিমানবন্দর সংলগ্ন অঞ্চল: ₹৩,৫০০–₹৬,৫০০/বর্গফুট।</li><li><b>লিজহোল্ড প্লট:</b> মৌজা অনুযায়ী রেট ভিন্ন — নির্দিষ্ট মৌজার জন্য wbregistration.gov.in দেখুন।</li>`,
      newTownAAStampNote: 'নিউ টাউনের সম্পত্তিতে স্ট্যাম্প ডিউটি <b>৬% (শহরাঞ্চল)</b>। ₹১ কোটির বেশি সম্পত্তিতে <b>১% সারচার্জ</b> যুক্ত হয়ে কার্যকর হার দাঁড়ায় <b>৭%</b>। সঠিক হিসাবের জন্য IGR পোর্টালে আপনার অ্যাকশন এরিয়ার সার্কেল রেট দেখুন।'
    }
  };

  exports.WB_I18N = {
    T
  };
})(window);

  window.WB_I18N = (typeof WB_I18N !== 'undefined') ? WB_I18N : { T };
  window.WB_I18N_MODULE = { WB_I18N: window.WB_I18N };

  // --- 3. CALCULATION ENGINE ---
  function calculateWbStampDuty(params) {
    const val = Math.max(0, Number(params.propertyValue) || 0);
    const zone = params.zone === 'rural' ? 'rural' : 'urban';
    const deedType = params.deedType || 'sale';
    const buyerGender = params.buyerGender || 'male';

    if (val <= 0) {
      return {
        propertyVal: 0, zone, deedType, buyerGender,
        baseRate: 0, baseDuty: 0,
        hasSurcharge: false, surchargeRate: 0, surchargeAmt: 0,
        hasGenderRebate: false, rebateRate: 0, rebateAmt: 0,
        totalDuty: 0, effectiveDutyRate: 0,
        regFee: 0, regRateLabel: '1.1%',
        totalPayable: 0, breakdown: []
      };
    }

    const isPOA = deedType === 'poa';
    const isGiftRelative = deedType === 'gift_relative';

    let baseRate = 0;
    let baseDuty = 0;
    let hasSurcharge = false;
    let surchargeAmt = 0;
    let hasGenderRebate = false;
    let rebateAmt = 0;
    let totalDuty = 0;
    let regFee = 0;
    let regRateLabel = '1.1%';

    if (isPOA) {
      baseRate = 0;
      baseDuty = 1000;
      hasSurcharge = false;
      surchargeAmt = 0;
      hasGenderRebate = false;
      rebateAmt = 0;
      totalDuty = 1000;
      regFee = 200;
      regRateLabel = '₹200 flat';
    } else if (isGiftRelative) {
      baseRate = 0.005;
      baseDuty = Math.ceil(val * 0.005);
      hasSurcharge = false;
      surchargeAmt = 0;
      hasGenderRebate = false;
      rebateAmt = 0;
      totalDuty = baseDuty;
      regFee = Math.ceil(val * 0.011);
      regRateLabel = '1.1%';
    } else {
      baseRate = zone === 'urban' ? 0.06 : 0.05;
      baseDuty = Math.ceil(val * baseRate);
      hasSurcharge = val > WB_RATES.SURCHARGE.threshold;
      surchargeAmt = hasSurcharge ? Math.ceil(val * WB_RATES.SURCHARGE.rate) : 0;
      hasGenderRebate = (buyerGender === 'female' || buyerGender === 'joint');
      rebateAmt = hasGenderRebate ? Math.ceil(val * WB_RATES.GENDER_REBATE[buyerGender]) : 0;
      totalDuty = Math.max(0, baseDuty + surchargeAmt - rebateAmt);
      regFee = Math.ceil(val * WB_RATES.REGISTRATION_FEE.standardRate);
      regRateLabel = '1.1%';
    }

    const effectiveDutyRate = val > 0 ? (totalDuty / val) * 100 : 0;
    const totalPayable = totalDuty + regFee;

    return {
      propertyVal: val, zone, deedType, buyerGender,
      baseRate, baseDuty,
      hasSurcharge, surchargeRate: hasSurcharge ? WB_RATES.SURCHARGE.rate : 0, surchargeAmt,
      hasGenderRebate, rebateRate: hasGenderRebate ? WB_RATES.GENDER_REBATE[buyerGender] : 0, rebateAmt,
      totalDuty, effectiveDutyRate,
      regFee, regRateLabel, totalPayable
    };
  }

  const WB_CALCULATOR = { calculateWbStampDuty };
  window.WB_CALCULATOR = WB_CALCULATOR;
  window.WB_CALCULATOR_MODULE = { WB_CALCULATOR };

  // --- 4. UI CONTROLLER & APP BOOTSTRAP (BROWSER ONLY) ---
  if (typeof document !== 'undefined') {
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

  }

  return {
    WB_CALCULATOR,
    calculateWbStampDuty,
    WB_RATES,
    WB_I18N: window.WB_I18N
  };
});
