/**
 * Bengaluru (Karnataka) Stamp Duty Calculator - Core Computation Logic
 * Decoupled calculation engine for browser and unit testing
 */

(function (exports) {
  'use strict';

  // Import rates config (Node or window)
  const ratesConfig = (typeof require !== 'undefined')
    ? require('../config/rates-data.js').KARNATAKA_RATES
    : (window.KARNATAKA_RATES_MODULE ? window.KARNATAKA_RATES_MODULE.KARNATAKA_RATES : null);

  /**
   * Computes Bengaluru / Karnataka stamp duty, cesses, and registration charges
   * @param {Object} params
   * @param {number} params.agreementValue - Agreed purchase/consideration value in INR
   * @param {number} params.guidanceValue - Government guidance circle rate valuation in INR
   * @param {string} params.deedType - 'sale' | 'gift_family' | 'gift_other'
   * @param {string} params.locationArea - 'bbmp' | 'municipal_council' | 'gram_panchayat'
   * @param {string} params.buyerGender - 'male' | 'female' | 'joint'
   * @returns {Object} itemized breakdown
   */
  function calculateBangaloreStampDuty(params) {
    const agreementVal = Math.max(0, Number(params.agreementValue) || 0);
    const guidanceVal = Math.max(0, Number(params.guidanceValue) || 0);
    const deedType = params.deedType || 'sale';
    const locationArea = params.locationArea || 'bbmp';
    const buyerGender = params.buyerGender || 'male';

    // Legal Valuation Principle: Higher of Agreement Value and Guidance Value
    const chargeableVal = Math.max(agreementVal, guidanceVal);
    const valuationBasis = agreementVal >= guidanceVal ? 'agreement' : 'guidance';

    if (chargeableVal <= 0) {
      return {
        chargeableVal: 0,
        agreementVal,
        guidanceVal,
        valuationBasis,
        deedType,
        locationArea,
        buyerGender,
        baseStampDuty: 0,
        cessAmount: 0,
        surchargeAmount: 0,
        totalStampDuty: 0,
        registrationFee: 0,
        totalStatutoryOutgo: 0,
        effectiveTotalRate: 0,
        tdsApplicable: false,
        tdsAmount: 0,
        breakdown: []
      };
    }

    // A. Family Gift Deed (Article 28 Concession)
    if (deedType === 'gift_family') {
      const giftCfg = ratesConfig.FAMILY_GIFT_FIXED[locationArea] || ratesConfig.FAMILY_GIFT_FIXED.bbmp;
      const baseStampDuty = giftCfg.baseDuty;
      const cessAmount = Math.ceil(baseStampDuty * giftCfg.cessPercent);
      const surchargeAmount = Math.ceil(baseStampDuty * giftCfg.surchargePercent);
      const totalStampDuty = baseStampDuty + cessAmount + surchargeAmount;
      const registrationFee = giftCfg.regFee;
      const totalStatutoryOutgo = totalStampDuty + registrationFee;

      const breakdown = [
        {
          id: 'base_duty',
          label: `Concessional Base Stamp Duty (${giftCfg.label})`,
          amount: baseStampDuty,
          isFixed: true
        },
        {
          id: 'cess',
          label: 'Infrastructure Cess (10% of stamp duty)',
          amount: cessAmount,
          isFixed: true
        },
        {
          id: 'surcharge',
          label: `Local Surcharge (${(giftCfg.surchargePercent * 100).toFixed(0)}% of stamp duty)`,
          amount: surchargeAmount,
          isFixed: true
        },
        {
          id: 'registration_fee',
          label: 'Fixed Registration Fee (Family Transfer)',
          amount: registrationFee,
          isFixed: true
        }
      ];

      return {
        chargeableVal,
        agreementVal,
        guidanceVal,
        valuationBasis,
        deedType,
        locationArea,
        buyerGender,
        baseStampDuty,
        cessAmount,
        surchargeAmount,
        totalStampDuty,
        registrationFee,
        totalStatutoryOutgo,
        effectiveTotalRate: Number(((totalStatutoryOutgo / chargeableVal) * 100).toFixed(4)),
        tdsApplicable: false,
        tdsAmount: 0,
        isFixedFamilyTransfer: true,
        breakdown,
        ratesSource: 'Kaveri Online Services (Karnataka Department of Stamps and Registration)',
        verificationDate: 'May 2026'
      };
    }

    // B. Standard Sale Deed or Gift to Non-Family
    const baseRate = ratesConfig.getBaseDutyRate(chargeableVal);
    const isRural = (locationArea === 'gram_panchayat');
    const surchargePercent = isRural
      ? ratesConfig.CESS_RATES.ruralSurchargeOnDuty
      : ratesConfig.CESS_RATES.urbanSurchargeOnDuty;

    const baseStampDuty = Math.round(chargeableVal * baseRate);
    const cessAmount = Math.round(baseStampDuty * ratesConfig.CESS_RATES.cessOnDuty); // 10% of duty
    const surchargeAmount = Math.round(baseStampDuty * surchargePercent); // 2% of duty (or 3% rural)
    const totalStampDuty = baseStampDuty + cessAmount + surchargeAmount;

    // Registration Fee: Flat 2% of property value
    const registrationFee = Math.round(chargeableVal * ratesConfig.REGISTRATION_FEE_RATE);

    const totalStatutoryOutgo = totalStampDuty + registrationFee;
    const effectiveTotalRate = (totalStatutoryOutgo / chargeableVal) * 100;

    // TDS Check (Section 194-IA >= ₹50L, 1%)
    const tdsApplicable = (chargeableVal >= 5000000 && deedType === 'sale');
    const tdsAmount = tdsApplicable ? Math.round(chargeableVal * 0.01) : 0;

    const breakdown = [
      {
        id: 'base_duty',
        label: `Base Stamp Duty (${(baseRate * 100).toFixed(0)}% Slab)`,
        ratePercent: baseRate * 100,
        amount: baseStampDuty
      },
      {
        id: 'cess',
        label: 'Infrastructure Cess (10% of Base Duty)',
        ratePercent: baseRate * 10,
        amount: cessAmount
      },
      {
        id: 'surcharge',
        label: `${isRural ? 'Rural' : 'Urban'} Surcharge (${(surchargePercent * 100).toFixed(0)}% of Base Duty)`,
        ratePercent: baseRate * (surchargePercent * 100),
        amount: surchargeAmount
      },
      {
        id: 'registration_fee',
        label: `Registration Fee (${(ratesConfig.REGISTRATION_FEE_RATE * 100).toFixed(0)}% Flat)`,
        ratePercent: ratesConfig.REGISTRATION_FEE_RATE * 100,
        amount: registrationFee
      }
    ];

    return {
      chargeableVal,
      agreementVal,
      guidanceVal,
      valuationBasis,
      deedType,
      locationArea,
      buyerGender,
      baseStampDuty,
      baseRate: baseRate * 100,
      cessAmount,
      surchargeAmount,
      totalStampDuty,
      registrationFee,
      registrationRate: ratesConfig.REGISTRATION_FEE_RATE * 100,
      totalStatutoryOutgo,
      effectiveTotalRate: Number(effectiveTotalRate.toFixed(2)),
      tdsApplicable,
      tdsAmount,
      isFixedFamilyTransfer: false,
      breakdown,
      ratesSource: 'Kaveri Online Services (Karnataka Department of Stamps and Registration)',
      verificationDate: 'May 2026'
    };
  }

  exports.BANGALORE_CALCULATOR = {
    calculateBangaloreStampDuty
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.BANGALORE_CALCULATOR_MODULE = {}));
