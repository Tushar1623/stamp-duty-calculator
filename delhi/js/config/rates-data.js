/**
 * Delhi (NCT) Stamp Duty & Registration Charges Configuration
 * Rates verified against Department of Revenue, Government of NCT of Delhi (revenue.delhi.gov.in)
 * and Municipal Corporation of Delhi (MCD) Gazette Notification (Revised Transfer Duty effective July 10, 2023)
 * Legal Reference: The Indian Stamp Act, 1899 (Delhi Schedule) & Delhi Municipal Corporation Act, 1957
 * Last Verified: May 2026
 */

(function (exports) {
  'use strict';

  // Base State Stamp Duty Rates by Buyer Profile
  const STATE_STAMP_DUTY = {
    male: 0.03,    // 3.0% for Male / Corporate / General buyers
    female: 0.02,  // 2.0% for Sole Female buyers (200 bps statutory rebate)
    joint: 0.025   // 2.5% for Joint Male + Female (Spousal / Blended)
  };

  // MCD Transfer Duty Rates (Municipal Corporation of Delhi)
  // Threshold: ₹25,00,000 (Sub-25L vs Above-25L)
  const MCD_TRANSFER_DUTY = {
    threshold: 2500000,
    sub25L: {
      male: 0.03,    // 3.0%
      female: 0.02,  // 2.0%
      joint: 0.025   // 2.5%
    },
    above25L: {
      male: 0.04,    // 4.0% (+1% revision under July 2023 Notification)
      female: 0.03,  // 3.0% (+1% revision)
      joint: 0.035   // 3.5% (+1% revision)
    }
  };

  // Standard Registration Fee
  const REGISTRATION_FEE_RATE = 0.01; // 1% of property valuation
  const PASTING_FEE = 100; // Flat ₹100 pasting / processing charge in Delhi Sub-Registrar Offices

  /**
   * Helper to retrieve Delhi statutory rate components
   * @param {string} gender - 'male' | 'female' | 'joint'
   * @param {number} val - Chargeable property valuation
   * @param {string} municipalArea - 'mcd' | 'ndmc_cantt'
   */
  function getDelhiRates(gender, val, municipalArea) {
    const gKey = (gender === 'female' || gender === 'joint') ? gender : 'male';
    const stateDutyRate = STATE_STAMP_DUTY[gKey];

    let mcdTransferRate = 0;
    if (municipalArea !== 'ndmc_cantt') {
      const isAbove25L = (val > MCD_TRANSFER_DUTY.threshold);
      mcdTransferRate = isAbove25L
        ? MCD_TRANSFER_DUTY.above25L[gKey]
        : MCD_TRANSFER_DUTY.sub25L[gKey];
    }

    return {
      genderKey: gKey,
      stateDutyRate,
      mcdTransferRate,
      totalStampDutyRate: stateDutyRate + mcdTransferRate,
      registrationRate: REGISTRATION_FEE_RATE,
      pastingFee: PASTING_FEE
    };
  }

  exports.DELHI_RATES = {
    STATE_STAMP_DUTY,
    MCD_TRANSFER_DUTY,
    REGISTRATION_FEE_RATE,
    PASTING_FEE,
    getDelhiRates
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.DELHI_RATES_MODULE = {}));
