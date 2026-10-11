/**
 * Maharashtra Stamp Duty Calculator - Core Business Logic Engine
 * Pure computation functions decoupled from DOM rendering.
 */

(function (window) {
  'use strict';

  /**
   * Computes comprehensive stamp duty and registration breakdown
   * @param {Object} params
   * @param {number} params.val - Higher of Agreement Value or Ready Reckoner
   * @param {string} params.area - Selected area key
   * @param {string} params.gender - 'male' | 'female' | 'joint'
   * @param {string} params.zone - 'urban' | 'mun_council' | 'rural'
   * @param {string} params.deed - 'sale' | 'gift_relative' | 'gift_other' | 'poa'
   * @returns {Object} Computed results breakdown
   */
  function computeStampDuty(params) {
    const { val, area, gender, zone, deed } = params;

    const ratesConfig = window.MH_RATES || {};
    const DEED = ratesConfig.DEED;
    const getRates = ratesConfig.getRates;

    const cfg = DEED[deed] || DEED.sale;
    const isPOA = (deed === 'poa');
    const isGiftR = (deed === 'gift_relative');
    const isStd = (!isPOA && !isGiftR);

    const rates = getRates(area, gender, zone);
    const totalRate = rates.base + rates.metro + rates.lbt;
    const effectiveRate = totalRate;

    // Computed duty components
    const baseDutyAmt = isStd ? Math.ceil(val * rates.base) : 0;
    const metroAmt    = isStd ? Math.ceil(val * rates.metro) : 0;
    const lbtAmt      = isStd ? Math.ceil(val * rates.lbt) : 0;

    const rawDuty = cfg.stampFn(val, rates);
    const reg     = cfg.regFn(val);
    const total   = rawDuty + reg;

    // Rebate calculations: Sole female owners receive 1% rebate on base duty
    const showRebateRow = (gender === 'female') && isStd && !isPOA;
    const rebateAmt = showRebateRow ? Math.ceil(val * 0.01) : 0;

    // Region applicability flags
    const showMR  = isStd && rates.metro > 0;
    const showLBT = isStd && rates.lbt > 0;
    const isMMR   = (area === 'navi-mumbai' || area === 'thane' || area === 'mumbai-city' || area === 'mumbai-suburban');

    return {
      val,
      area,
      gender,
      zone,
      deed,
      regLabel: cfg.regLabel,
      rates,
      totalRate,
      effectiveRate,
      baseDutyAmt,
      metroAmt,
      lbtAmt,
      rawDuty,
      reg,
      total,
      rebateAmt,
      showRebateRow,
      showMR,
      showLBT,
      isPOA,
      isGiftR,
      isStd,
      isMMR
    };
  }

  // Expose module
  window.MH_CALCULATOR = {
    computeStampDuty
  };
})(window);
