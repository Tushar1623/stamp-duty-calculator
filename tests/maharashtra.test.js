/**
 * Regression Tests for Maharashtra Calculation Engine
 */

const assert = require('assert');

const { MH_CALCULATOR } = require('../assets/js/calculators/maharashtra.js');

function runMaharashtraTests() {
  console.log('--- Running Maharashtra Regression Tests ---');

  // Test 1: Mumbai City standard male purchase ₹1 Crore
  {
    const res = MH_CALCULATOR.computeStampDuty({
      val: 10000000,
      area: 'mumbai-city',
      gender: 'male',
      zone: 'urban',
      deed: 'sale'
    });
    // Mumbai City: 5% Base + 1% Metro Cess = 6% Total (₹6,00,000)
    assert.strictEqual(res.rawDuty, 600000, 'Mumbai city duty should be 6% (₹6,00,000)');
    // Reg fee: > 30L capped at ₹30,000
    assert.strictEqual(res.reg, 30000, 'Registration fee capped at ₹30,000');
    assert.strictEqual(res.total, 630000);
    console.log('✓ Test 1 Passed: Mumbai City ₹1 Cr standard calculation');
  }

  // Test 2: Navi Mumbai / Thane: 5% Base + 1% Metro Cess + 1% LBT = 7%
  {
    const res = MH_CALCULATOR.computeStampDuty({
      val: 5000000,
      area: 'navi-mumbai',
      gender: 'male',
      zone: 'urban',
      deed: 'sale'
    });
    assert.strictEqual(res.rawDuty, 350000, 'Navi Mumbai duty 7% on 50L = ₹3,50,000');
    assert.strictEqual(res.reg, 30000, 'Registration fee capped at ₹30,000');
    console.log('✓ Test 2 Passed: Navi Mumbai 7% duty + capped reg fee');
  }

  // Test 3: Female Buyer 1% Rebate
  {
    const res = MH_CALCULATOR.computeStampDuty({
      val: 5000000,
      area: 'mumbai-city',
      gender: 'female',
      zone: 'urban',
      deed: 'sale'
    });
    // Female gets 4% base + 1% metro = 5% (₹2,50,000)
    assert.strictEqual(res.rawDuty, 250000, 'Female buyer duty 5% on 50L = ₹2,50,000');
    console.log('✓ Test 3 Passed: Maharashtra female buyer 1% rebate');
  }
}

module.exports = { runMaharashtraTests };
if (require.main === module) {
  runMaharashtraTests();
}
