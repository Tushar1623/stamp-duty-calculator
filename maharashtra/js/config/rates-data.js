/**
 * Maharashtra Stamp Duty Calculator - Rates and Statutory Slabs Configuration
 * Rates as per Maharashtra Stamp Act & IGR Maharashtra Annual Statement of Rates (ASR) 2025-2026.
 */

// Registration Fee Formula:
// - Up to ₹30 Lakhs: 1% of Market Value
// - Above ₹30 Lakhs: Flat ₹30,000 maximum cap under Maharashtra Stamp Rules
function getRegFee(val) {
  if (!val || val <= 0) return 0;
  return val > 3000000 ? 30000 : Math.ceil(val * 0.01);
}

// Rates Lookup Table:
// Returns { base, metro, lbt } rates as decimals
function getRates(area, gender, zone) {
  const female = (gender === 'female'); // Sole female owner gets 1% rebate on base rate

  // Navi Mumbai (NMMC/CIDCO) & Thane (TMC): 5% base (4% female) + 1% Metro Cess + 1% LBT = 7% (6% female)
  if (area === 'navi-mumbai' || area === 'thane') {
    return {
      base: female ? 0.04 : 0.05,
      metro: 0.01,
      lbt: 0.01
    };
  }

  // Mumbai City (BMC - South) & Mumbai Suburban: 5% base (4% female) + 1% Metro Cess + 0% LBT = 6% (5% female)
  if (area === 'mumbai-city' || area === 'mumbai-suburban') {
    return {
      base: female ? 0.04 : 0.05,
      metro: 0.01,
      lbt: 0
    };
  }

  // Other Districts (Pune, Nagpur, Nashik, etc.):
  // Urban / Corp: 7% (6% female)
  // Municipal Council: 6% (5% female)
  // Rural / Gram Panchayat: 5% (4% female)
  const zoneRateMap = {
    urban:       female ? 0.06 : 0.07,
    mun_council: female ? 0.05 : 0.06,
    rural:       female ? 0.04 : 0.05,
  };

  return {
    base: zoneRateMap[zone || 'urban'],
    metro: 0,
    lbt: 0
  };
}

// Deeds Configuration
const DEED = {
  sale: {
    stampFn: (v, r) => Math.round(v * (r.base + r.metro + r.lbt)),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  gift_relative: {
    stampFn: (v) => Math.round(v * 0.02),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  gift_other: {
    stampFn: (v, r) => Math.round(v * (r.base + r.metro + r.lbt)),
    regFn: getRegFee,
    regLabel: '1% (cap ₹30k)'
  },
  poa: {
    stampFn: () => 500,
    regFn: () => 200,
    regLabel: '₹200 flat'
  },
};

// Expose globally
window.MH_RATES = {
  getRegFee,
  getRates,
  DEED
};
