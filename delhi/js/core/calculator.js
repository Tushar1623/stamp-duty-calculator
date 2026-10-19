/**
 * Delhi (NCT) Stamp Duty Calculator - Core Computation Logic
 * Decoupled calculation engine for browser and unit testing
 */

(function (exports) {
  'use strict';

  // Import rates config (Node or window)
  const ratesConfig = (typeof require !== 'undefined')
    ? require('../config/rates-data.js').DELHI_RATES
    : (window.DELHI_RATES_MODULE ? window.DELHI_RATES_MODULE.DELHI_RATES : null);

  /**
   * Computes Delhi (NCT) stamp duty, MCD transfer duty, and registration charges
   * @param {Object} params
   * @param {number} params.agreementValue - Agreed purchase/consideration value in INR
   * @param {number} params.circleRateValue - Government circle rate valuation in INR
   * @param {string} params.buyerGender - 'male' | 'female' | 'joint'
   * @param {string} params.municipalArea - 'mcd' | 'ndmc_cantt'
   * @param {string} params.deedType - 'sale' | 'gift'
   * @returns {Object} itemized breakdown
   */
  function calculateDelhiStampDuty(params) {
    const agreementVal = Math.max(0, Number(params.agreementValue) || 0);
    const circleRateVal = Math.max(0, Number(params.circleRateValue) || 0);
    const buyerGender = params.buyerGender || 'male';
    const municipalArea = params.municipalArea || 'mcd';
    const deedType = params.deedType || 'sale';

    // Legal Valuation Principle: Higher of Agreement Value and Notified Circle Rate
    const chargeableVal = Math.max(agreementVal, circleRateVal);
    const valuationBasis = agreementVal >= circleRateVal ? 'agreement' : 'circle_rate';

    if (chargeableVal <= 0) {
      return {
        chargeableVal: 0,
        agreementVal,
        circleRateVal,
        valuationBasis,
        buyerGender,
        municipalArea,
        deedType,
        stateStampDuty: 0,
        mcdTransferDuty: 0,
        totalStampDuty: 0,
        registrationFee: 0,
        pastingFee: 0,
        totalStatutoryOutgo: 0,
        effectiveTotalRate: 0,
        tdsApplicable: false,
        tdsAmount: 0,
        femaleRebateSavings: 0,
        breakdown: []
      };
    }

    const rates = ratesConfig.getDelhiRates(buyerGender, chargeableVal, municipalArea);

    // 1. Base State Stamp Duty
    const stateStampDuty = Math.round(chargeableVal * rates.stateDutyRate);

    // 2. MCD Transfer Duty (if applicable)
    const mcdTransferDuty = Math.round(chargeableVal * rates.mcdTransferRate);

    // Total Stamp Duty (State Duty + MCD Duty)
    const totalStampDuty = stateStampDuty + mcdTransferDuty;

    // 3. Registration Fee (1% of property valuation)
    const registrationFee = Math.round(chargeableVal * rates.registrationRate);
    const pastingFee = rates.pastingFee || 100;

    // 4. Total Statutory Outgo
    const totalStatutoryOutgo = totalStampDuty + registrationFee + pastingFee;
    const effectiveTotalRate = (totalStatutoryOutgo / chargeableVal) * 100;

    // Female Concession Comparison Savings vs Male Buyer:
    // Male total duty rate vs selected total duty rate
    const maleRates = ratesConfig.getDelhiRates('male', chargeableVal, municipalArea);
    const maleTotalDuty = Math.round(chargeableVal * maleRates.totalStampDutyRate);
    const femaleRebateSavings = (buyerGender === 'female' || buyerGender === 'joint')
      ? Math.max(0, maleTotalDuty - totalStampDuty)
      : 0;

    // 5. Section 194-IA TDS Check (>= ₹50L, 1%)
    const tdsApplicable = (chargeableVal >= 5000000 && deedType === 'sale');
    const tdsAmount = tdsApplicable ? Math.round(chargeableVal * 0.01) : 0;

    // Line items
    const breakdown = [
      {
        id: 'state_stamp_duty',
        label: `State Stamp Duty (${(rates.stateDutyRate * 100).toFixed(1)}% - ${buyerGender === 'female' ? 'Women Concession' : buyerGender === 'joint' ? 'Joint Spousal' : 'Standard'})`,
        ratePercent: rates.stateDutyRate * 100,
        amount: stateStampDuty
      }
    ];

    if (rates.mcdTransferRate > 0) {
      breakdown.push({
        id: 'mcd_transfer_duty',
        label: `MCD Transfer Duty (${(rates.mcdTransferRate * 100).toFixed(1)}% - ${chargeableVal > 2500000 ? 'Above ₹25L Surcharge Included' : 'Standard'})`,
        ratePercent: rates.mcdTransferRate * 100,
        amount: mcdTransferDuty
      });
    }

    breakdown.push(
      {
        id: 'registration_fee',
        label: `Registration Fee (${(rates.registrationRate * 100).toFixed(0)}%)`,
        ratePercent: rates.registrationRate * 100,
        amount: registrationFee
      },
      {
        id: 'pasting_fee',
        label: 'Sub-Registrar Pasting / Processing Fee',
        amount: pastingFee,
        isFixed: true
      }
    );

    return {
      chargeableVal,
      agreementVal,
      circleRateVal,
      valuationBasis,
      buyerGender,
      municipalArea,
      deedType,
      stateStampDuty,
      stateDutyRate: rates.stateDutyRate * 100,
      mcdTransferDuty,
      mcdTransferRate: rates.mcdTransferRate * 100,
      totalStampDuty,
      totalStampDutyRate: rates.totalStampDutyRate * 100,
      registrationFee,
      registrationRate: rates.registrationRate * 100,
      pastingFee,
      totalStatutoryOutgo,
      effectiveTotalRate: Number(effectiveTotalRate.toFixed(2)),
      femaleRebateSavings,
      tdsApplicable,
      tdsAmount,
      breakdown,
      ratesSource: 'Department of Revenue, Govt. of NCT of Delhi & MCD Gazette Notification',
      verificationDate: 'May 2026'
    };
  }

  exports.DELHI_CALCULATOR = {
    calculateDelhiStampDuty
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.DELHI_CALCULATOR_MODULE = {}));
