/**
 * West Bengal Stamp Duty & Property Registration Calculator Engine
 * Pure computation module, completely decoupled from DOM manipulation.
 * Supports Node.js execution and unit testing.
 */

(function (exports) {
  'use strict';

  // Import rates config
  const ratesConfig = (typeof require !== 'undefined')
    ? require('../config/rates-data.js').WB_RATES
    : (window.WB_RATES_MODULE ? window.WB_RATES_MODULE.WB_RATES : null);

  /**
   * Calculates West Bengal stamp duty, surcharges, rebates, and registration fees
   * @param {Object} params
   * @param {number} params.propertyValue - Valuation in INR (Market Value or Agreement Value, whichever is higher)
   * @param {string} [params.zone='urban'] - 'urban' (Municipal/Corp) | 'rural' (Panchayat)
   * @param {string} [params.deedType='sale'] - 'sale' | 'gift_relative' | 'gift_other' | 'poa'
   * @param {string} [params.buyerGender='male'] - 'male' | 'female' | 'joint'
   * @returns {Object} Full calculation breakdown
   */
  function calculateWbStampDuty(params) {
    const val = Math.max(0, Number(params.propertyValue) || 0);
    const zone = params.zone === 'rural' ? 'rural' : 'urban';
    const deedType = params.deedType || 'sale';
    const buyerGender = params.buyerGender || 'male';

    if (val <= 0) {
      return {
        propertyVal: 0,
        zone,
        deedType,
        buyerGender,
        baseRate: 0,
        baseDuty: 0,
        hasSurcharge: false,
        surchargeRate: 0,
        surchargeAmt: 0,
        hasGenderRebate: false,
        rebateRate: 0,
        rebateAmt: 0,
        totalDuty: 0,
        effectiveDutyRate: 0,
        regFee: 0,
        regRateLabel: '1.1%',
        totalPayable: 0,
        breakdown: []
      };
    }

    const isPOA = deedType === 'poa';
    const isGiftRelative = deedType === 'gift_relative';
    const isStandard = !isPOA && !isGiftRelative; // sale or gift_other

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
      // General Power of Attorney: ₹1,000 flat duty + ₹200 flat registration
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
      // Gift to Blood Relative: 0.5% flat duty, NO surcharge, NO gender rebate
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
      // Standard deeds (Sale Deed / Gift to Non-Relative)
      baseRate = zone === 'urban' ? 0.06 : 0.05;
      baseDuty = Math.ceil(val * baseRate);

      // Surcharge of 1% on stamp duty for properties > ₹1 Crore
      hasSurcharge = val > ratesConfig.SURCHARGE.threshold;
      surchargeAmt = hasSurcharge ? Math.ceil(val * ratesConfig.SURCHARGE.rate) : 0;

      // 1% concession for Female / Joint buyers
      hasGenderRebate = (buyerGender === 'female' || buyerGender === 'joint');
      rebateAmt = hasGenderRebate ? Math.ceil(val * ratesConfig.GENDER_REBATE[buyerGender]) : 0;

      totalDuty = baseDuty + surchargeAmt - rebateAmt;
      regFee = Math.ceil(val * ratesConfig.REGISTRATION_FEE.standardRate);
      regRateLabel = '1.1%';
    }

    const totalPayable = totalDuty + regFee;
    const effectiveDutyRate = val > 0 ? (totalDuty / val) * 100 : 0;

    return {
      propertyVal: val,
      zone,
      deedType,
      buyerGender,
      baseRate,
      baseDuty,
      hasSurcharge,
      surchargeRate: hasSurcharge ? 0.01 : 0,
      surchargeAmt,
      hasGenderRebate,
      rebateRate: hasGenderRebate ? 0.01 : 0,
      rebateAmt,
      totalDuty,
      effectiveDutyRate: Number(effectiveDutyRate.toFixed(2)),
      regFee,
      regRateLabel,
      totalPayable,
      verificationSource: 'IGR West Bengal (wbregistration.gov.in)',
      verificationDate: 'May 2026'
    };
  }

  exports.WB_CALCULATOR = {
    calculateWbStampDuty
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.WB_CALCULATOR_MODULE = {}));
