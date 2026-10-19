/**
 * Chennai (Tamil Nadu) Stamp Duty & Registration Charges Configuration
 * Rates verified against Tamil Nadu Registration Department (TNREGINET - tnreginet.gov.in)
 * Legal Reference: The Indian Stamp Act, 1899 (Tamil Nadu Amendments) & The Registration Act, 1908
 * Last Verified: May 2026
 */

(function (exports) {
  'use strict';

  // Base Statutory Rates for Standard Conveyance (Sale Deed)
  const SALE_RATES = {
    stampDutyRate: 0.07, // 7% Stamp Duty across all price slabs
    standardRegRate: 0.04, // 4% Standard Registration Fee
    femaleSub10LRegRate: 0.03, // 3% Concessional Registration Fee for Sole Female Buyer up to ₹10 Lakhs
    femaleThreshold: 1000000 // ₹10,00,000 threshold for female registration concession
  };

  // Concessional Family Gift / Settlement Rates (Tamil Nadu Act No. 29 of 2020 / TNREGINET Revised Caps)
  // Eligible family: Father, mother, husband, wife, son, daughter, grandchild, brother, sister
  const FAMILY_DEED_RATES = {
    dutyPercent: 0.01, // 1% of Market/Guideline Value
    dutyCap: 40000,    // Capped at ₹40,000 maximum (Revised from earlier ₹25,000)
    regPercent: 0.01,  // 1% of Market/Guideline Value
    regCap: 10000      // Capped at ₹10,000 maximum (Revised from earlier ₹4,000)
  };

  /**
   * Returns applicable stamp duty and registration percentages/caps
   * @param {string} deed - 'sale' | 'gift_family' | 'settlement_family' | 'gift_other'
   * @param {string} gender - 'male' | 'female' | 'joint'
   * @param {number} chargeableVal - Higher of Agreement Value or Guideline Value
   */
  function getChennaiRates(deed, gender, chargeableVal) {
    if (deed === 'gift_family' || deed === 'settlement_family') {
      return {
        type: 'family_concession',
        dutyRate: 0.01,
        dutyCap: FAMILY_DEED_RATES.dutyCap,
        regRate: 0.01,
        regCap: FAMILY_DEED_RATES.regCap,
        isFemaleConcessionApplied: false
      };
    }

    if (deed === 'gift_other') {
      return {
        type: 'standard_conveyance',
        dutyRate: SALE_RATES.stampDutyRate,
        dutyCap: null,
        regRate: SALE_RATES.standardRegRate,
        regCap: null,
        isFemaleConcessionApplied: false
      };
    }

    // Standard Sale Deed
    const isFemaleConcession = (gender === 'female' && chargeableVal > 0 && chargeableVal <= SALE_RATES.femaleThreshold);
    return {
      type: 'standard_sale',
      dutyRate: SALE_RATES.stampDutyRate,
      dutyCap: null,
      regRate: isFemaleConcession ? SALE_RATES.femaleSub10LRegRate : SALE_RATES.standardRegRate,
      regCap: null,
      isFemaleConcessionApplied: isFemaleConcession
    };
  }

  exports.CHENNAI_RATES = {
    SALE_RATES,
    FAMILY_DEED_RATES,
    getChennaiRates
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.CHENNAI_RATES_MODULE = {}));
