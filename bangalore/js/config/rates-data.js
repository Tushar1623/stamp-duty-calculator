/**
 * Bengaluru (Karnataka) Stamp Duty & Registration Charges Configuration
 * Rates verified against Karnataka Department of Stamps and Registration (Kaveri 2.0 - kaverionline.karnataka.gov.in)
 * Legal Reference: The Karnataka Stamp Act, 1957 (with Karnataka Stamp Amendment Acts) & Karnataka Registration Rules
 * Last Verified: May 2026
 */

(function (exports) {
  'use strict';

  // Sale Deed Slabs for Base Stamp Duty
  const VALUE_SLABS = [
    {
      max: 2000000, // Up to ₹20 Lakhs
      baseRate: 0.02,
      label: 'Up to ₹20 Lakhs (2% Base)'
    },
    {
      max: 4500000, // ₹20,00,001 to ₹45 Lakhs
      baseRate: 0.03,
      label: '₹20L - ₹45 Lakhs (3% Base)'
    },
    {
      max: Infinity, // Above ₹45 Lakhs
      baseRate: 0.05,
      label: 'Above ₹45 Lakhs (5% Base)'
    }
  ];

  // Statutory Add-ons (Calculated on the Base Stamp Duty amount, not property value)
  const CESS_RATES = {
    cessOnDuty: 0.10, // 10% Infrastructure / Local Bodies Cess
    urbanSurchargeOnDuty: 0.02, // 2% Urban Surcharge (BBMP Limits / City Corporation)
    ruralSurchargeOnDuty: 0.03  // 3% Rural Surcharge (Gram Panchayat limits)
  };

  // Uniform Registration Fee across all slabs (revised to 2% under Karnataka Registration Rules)
  const REGISTRATION_FEE_RATE = 0.02;

  // Family Gift / Settlement Concession (Article 28, Karnataka Stamp Act)
  // For transfers to Father, Mother, Spouse, Son, Daughter, Grandchild, Brother, Sister
  const FAMILY_GIFT_FIXED = {
    bbmp: {
      baseDuty: 5000, // BBMP / City Corporation
      cessPercent: 0.10,
      surchargePercent: 0.02,
      regFee: 1000,
      label: 'BBMP / Bengaluru City Corporation'
    },
    municipal_council: {
      baseDuty: 3000, // Town / City Municipal Council
      cessPercent: 0.10,
      surchargePercent: 0.02,
      regFee: 1000,
      label: 'City / Town Municipal Council'
    },
    gram_panchayat: {
      baseDuty: 1000, // Gram Panchayat / Rural
      cessPercent: 0.10,
      surchargePercent: 0.03,
      regFee: 1000,
      label: 'Gram Panchayat / Rural Limits'
    }
  };

  /**
   * Helper to retrieve base duty rate for standard sale deed based on value
   */
  function getBaseDutyRate(val) {
    if (val <= 2000000) return 0.02;
    if (val <= 4500000) return 0.03;
    return 0.05;
  }

  exports.KARNATAKA_RATES = {
    VALUE_SLABS,
    CESS_RATES,
    REGISTRATION_FEE_RATE,
    FAMILY_GIFT_FIXED,
    getBaseDutyRate
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.KARNATAKA_RATES_MODULE = {}));
