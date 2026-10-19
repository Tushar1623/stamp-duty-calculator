/**
 * Chennai (Tamil Nadu) Stamp Duty Calculator - Core Computation Logic
 * Decoupled calculation engine for browser and unit testing
 */

(function (exports) {
  'use strict';

  // Import rates config (Node or window)
  const ratesConfig = (typeof require !== 'undefined')
    ? require('../config/rates-data.js').CHENNAI_RATES
    : (window.CHENNAI_RATES_MODULE ? window.CHENNAI_RATES_MODULE.CHENNAI_RATES : null);

  /**
   * Computes Chennai / Tamil Nadu stamp duty & registration charges
   * @param {Object} params
   * @param {number} params.agreementValue - Agreed purchase/consideration value in INR
   * @param {number} params.guidelineValue - Government guideline circle rate valuation in INR
   * @param {string} params.deedType - 'sale' | 'gift_family' | 'settlement_family' | 'gift_other'
   * @param {string} params.buyerGender - 'male' | 'female' | 'joint'
   * @returns {Object} itemized breakdown
   */
  function calculateChennaiStampDuty(params) {
    const agreementVal = Math.max(0, Number(params.agreementValue) || 0);
    const guidelineVal = Math.max(0, Number(params.guidelineValue) || 0);
    const deedType = params.deedType || 'sale';
    const buyerGender = params.buyerGender || 'male';

    // Legal Valuation Principle: Statutory duty applies to the higher of agreement value and guideline value
    const chargeableVal = Math.max(agreementVal, guidelineVal);
    const valuationBasis = agreementVal >= guidelineVal ? 'agreement' : 'guideline';

    if (chargeableVal <= 0) {
      return {
        chargeableVal: 0,
        agreementVal,
        guidelineVal,
        valuationBasis,
        stampDuty: 0,
        stampDutyRate: 0,
        registrationFee: 0,
        registrationRate: 0,
        totalStatutoryOutgo: 0,
        effectiveTotalRate: 0,
        tdsApplicable: false,
        tdsAmount: 0,
        isFemaleConcessionApplied: false,
        isFamilyCapped: false,
        breakdown: []
      };
    }

    const rates = ratesConfig.getChennaiRates(deedType, buyerGender, chargeableVal);

    // 1. Calculate Stamp Duty
    let rawStampDuty = Math.round(chargeableVal * rates.dutyRate);
    let isStampCapped = false;
    if (rates.dutyCap && rawStampDuty > rates.dutyCap) {
      rawStampDuty = rates.dutyCap;
      isStampCapped = true;
    }
    const stampDuty = rawStampDuty;

    // 2. Calculate Registration Fee
    let rawRegFee = Math.round(chargeableVal * rates.regRate);
    let isRegCapped = false;
    if (rates.regCap && rawRegFee > rates.regCap) {
      rawRegFee = rates.regCap;
      isRegCapped = true;
    }
    const registrationFee = rawRegFee;

    // 3. Total Statutory Outgo (Stamp Duty + Registration Fee)
    const totalStatutoryOutgo = stampDuty + registrationFee;
    const effectiveTotalRate = (totalStatutoryOutgo / chargeableVal) * 100;

    // 4. Section 194-IA TDS Check (Informational obligation, >= ₹50L, 1%)
    const tdsApplicable = (chargeableVal >= 5000000 && (deedType === 'sale'));
    const tdsAmount = tdsApplicable ? Math.round(chargeableVal * 0.01) : 0;

    // 5. Line item breakdown
    const breakdown = [
      {
        id: 'stamp_duty',
        label: isStampCapped ? `Stamp Duty (1% Capped at ₹${rates.dutyCap.toLocaleString('en-IN')})` : `Stamp Duty (${(rates.dutyRate * 100).toFixed(1)}%)`,
        ratePercent: isStampCapped ? (stampDuty / chargeableVal) * 100 : rates.dutyRate * 100,
        amount: stampDuty,
        isCapped: isStampCapped
      },
      {
        id: 'registration_fee',
        label: isRegCapped ? `Registration Fee (1% Capped at ₹${rates.regCap.toLocaleString('en-IN')})` : `Registration Fee (${(rates.regRate * 100).toFixed(1)}%)`,
        ratePercent: isRegCapped ? (registrationFee / chargeableVal) * 100 : rates.regRate * 100,
        amount: registrationFee,
        isCapped: isRegCapped
      }
    ];

    return {
      chargeableVal,
      agreementVal,
      guidelineVal,
      valuationBasis,
      deedType,
      buyerGender,
      stampDuty,
      stampDutyRate: rates.dutyRate * 100,
      registrationFee,
      registrationRate: rates.regRate * 100,
      totalStatutoryOutgo,
      effectiveTotalRate: Number(effectiveTotalRate.toFixed(2)),
      tdsApplicable,
      tdsAmount,
      isFemaleConcessionApplied: rates.isFemaleConcessionApplied,
      isFamilyCapped: isStampCapped || isRegCapped,
      breakdown,
      ratesSource: 'TNREGINET (Tamil Nadu Registration Department)',
      verificationDate: 'May 2026'
    };
  }

  exports.CHENNAI_CALCULATOR = {
    calculateChennaiStampDuty
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CHENNAI_CALCULATOR_MODULE = {}));
