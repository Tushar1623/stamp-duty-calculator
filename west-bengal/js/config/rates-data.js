/**
 * West Bengal Stamp Duty & Registration Rates Configuration
 * Governed by West Bengal Stamp (Amendment) Act & IGR West Bengal guidelines.
 */

(function (exports) {
  'use strict';

  const WB_RATES = {
    // Base Stamp Duty Rates
    BASE_DUTY: {
      urban: 0.06, // 6% in Municipal / Corporation areas
      rural: 0.05  // 5% in Panchayat / Rural areas
    },

    // High-Value Surcharge (> ₹1 Crore)
    SURCHARGE: {
      threshold: 10000000, // ₹1,00,00,000
      rate: 0.01           // 1% additional stamp duty
    },

    // Concession: 1% rebate for Female or Joint (with female co-owner) buyers
    GENDER_REBATE: {
      female: 0.01,
      joint: 0.01,
      male: 0.00
    },

    // Statutory Registration Fee
    REGISTRATION_FEE: {
      standardRate: 0.011, // 1.1% of market value (no statutory cap in WB)
      poaFlat: 200         // ₹200 flat for General Power of Attorney
    },

    // Special Deed Specific Provisions
    DEEDS: {
      sale: {
        isStandard: true,
        dutyType: 'percentage',
        regType: 'percentage'
      },
      gift_relative: {
        isStandard: false,
        flatDutyRate: 0.005, // 0.5% flat between blood relatives (spouse, parent, child, sibling, grandchild)
        exemptFromSurcharge: true,
        exemptFromGenderRebate: true, // Flat 0.5% rate is already concessional
        regType: 'percentage'
      },
      gift_other: {
        isStandard: true,
        dutyType: 'percentage',
        regType: 'percentage'
      },
      poa: {
        isStandard: false,
        flatDutyAmount: 1000, // ₹1,000 flat stamp duty
        flatRegAmount: 200,   // ₹200 flat registration fee
        exemptFromSurcharge: true,
        exemptFromGenderRebate: true
      }
    }
  };

  exports.WB_RATES = WB_RATES;
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.WB_RATES_MODULE = {}));
