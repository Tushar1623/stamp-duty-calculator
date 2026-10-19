/**
 * Unit and Regression Tests for Bengaluru (Karnataka) Calculation Engine
 */

const assert = require('assert');
const { BANGALORE_CALCULATOR } = require('../bangalore/js/core/calculator.js');

function runBangaloreTests() {
  console.log('--- Running Bengaluru (Karnataka) Engine Tests ---');

  // Test 1: Worked Financial Model from PDF - ₹1.00 Crore Residential Acquisition (> ₹45 Lakhs Slab)
  {
    const res = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({
      agreementValue: 10000000,
      guidanceValue: 9500000,
      deedType: 'sale',
      locationArea: 'bbmp',
      buyerGender: 'male'
    });
    assert.strictEqual(res.chargeableVal, 10000000);
    assert.strictEqual(res.baseStampDuty, 500000, '5% base duty on ₹1 Cr = ₹5,00,000');
    assert.strictEqual(res.cessAmount, 50000, '10% cess on duty = ₹50,000');
    assert.strictEqual(res.surchargeAmount, 10000, '2% urban surcharge on duty = ₹10,000');
    assert.strictEqual(res.totalStampDuty, 560000, 'Total duty = ₹5,60,000 (5.6%)');
    assert.strictEqual(res.registrationFee, 200000, '2% flat registration fee = ₹2,00,000');
    assert.strictEqual(res.totalStatutoryOutgo, 760000, 'Total outgo = ₹7,60,000 (reconciled ~7.55% - 7.60%)');
    assert.strictEqual(res.tdsApplicable, true, 'TDS must apply for >= ₹50L');
    assert.strictEqual(res.tdsAmount, 100000, '1% TDS = ₹1,00,000');
    console.log('✓ Test 1 Passed: ₹1 Cr Bengaluru acquisition matches verified statutory rates (5.6% duty + 2% reg)');
  }

  // Test 2: Slab 1 - Property up to ₹20 Lakhs (2% Base Duty)
  {
    const res = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({
      agreementValue: 1800000,
      guidanceValue: 1500000,
      deedType: 'sale',
      locationArea: 'bbmp'
    });
    assert.strictEqual(res.baseStampDuty, 36000, '2% of 18L = ₹36,000');
    assert.strictEqual(res.cessAmount, 3600, '10% of 36k = ₹3,600');
    assert.strictEqual(res.surchargeAmount, 720, '2% of 36k = ₹720');
    assert.strictEqual(res.registrationFee, 36000, '2% of 18L = ₹36,000');
    assert.strictEqual(res.totalStatutoryOutgo, 36000 + 3600 + 720 + 36000);
    console.log('✓ Test 2 Passed: Slab 1 (<= ₹20 Lakhs) base 2% + cesses + 2% reg fee verified');
  }

  // Test 3: Slab 2 - Property between ₹20,00,001 and ₹45,00,000 (3% Base Duty)
  {
    const res = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({
      agreementValue: 3500000,
      guidanceValue: 3000000,
      deedType: 'sale',
      locationArea: 'bbmp'
    });
    assert.strictEqual(res.baseStampDuty, 105000, '3% of 35L = ₹1,05,000');
    assert.strictEqual(res.cessAmount, 10500, '10% of 1.05L = ₹10,500');
    assert.strictEqual(res.surchargeAmount, 2100, '2% of 1.05L = ₹2,100');
    assert.strictEqual(res.registrationFee, 70000, '2% of 35L = ₹70,000');
    console.log('✓ Test 3 Passed: Slab 2 (₹20L - ₹45L) base 3% + cesses + 2% reg fee verified');
  }

  // Test 4: Exactly at Boundary Conditions
  {
    const b20L = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 2000000, guidanceValue: 0 });
    assert.strictEqual(b20L.baseRate, 2, '₹20,00,000 exact boundary must be in 2% slab');

    const b20L1 = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 2000001, guidanceValue: 0 });
    assert.strictEqual(b20L1.baseRate, 3, '₹20,00,001 must be in 3% slab');

    const b45L = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 4500000, guidanceValue: 0 });
    assert.strictEqual(b45L.baseRate, 3, '₹45,00,000 exact boundary must be in 3% slab');

    const b45L1 = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 4500001, guidanceValue: 0 });
    assert.strictEqual(b45L1.baseRate, 5, '₹45,00,001 must be in 5% slab');
    console.log('✓ Test 4 Passed: Slab boundaries (₹20L and ₹45L) strictly verified without overlap');
  }

  // Test 5: Family Gift Deed in BBMP limits (Article 28 - Fixed ₹5,000 + ₹600 cesses + ₹1,000 reg)
  {
    const res = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({
      agreementValue: 0,
      guidanceValue: 8000000,
      deedType: 'gift_family',
      locationArea: 'bbmp'
    });
    assert.strictEqual(res.baseStampDuty, 5000, 'Fixed ₹5,000 base duty in BBMP');
    assert.strictEqual(res.cessAmount, 500, '10% cess = ₹500');
    assert.strictEqual(res.surchargeAmount, 100, '2% surcharge = ₹100');
    assert.strictEqual(res.totalStampDuty, 5600, 'Total duty = ₹5,600');
    assert.strictEqual(res.registrationFee, 1000, 'Fixed registration fee = ₹1,000');
    assert.strictEqual(res.totalStatutoryOutgo, 6600, 'Total family gift in BBMP = ₹6,600');
    console.log('✓ Test 5 Passed: Family gift deed in BBMP verified (fixed ₹5,600 duty + ₹1,000 reg)');
  }

  // Test 6: Family Gift Deed in Rural / Gram Panchayat limits (Fixed ₹1,000 + cesses + ₹1,000 reg)
  {
    const res = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({
      agreementValue: 0,
      guidanceValue: 3000000,
      deedType: 'gift_family',
      locationArea: 'gram_panchayat'
    });
    assert.strictEqual(res.baseStampDuty, 1000, 'Fixed ₹1,000 base duty in Gram Panchayat');
    assert.strictEqual(res.cessAmount, 100, '10% cess = ₹100');
    assert.strictEqual(res.surchargeAmount, 30, '3% rural surcharge = ₹30');
    assert.strictEqual(res.registrationFee, 1000, 'Fixed ₹1,000 reg fee');
    assert.strictEqual(res.totalStatutoryOutgo, 2130, 'Total = ₹2,130');
    console.log('✓ Test 6 Passed: Family gift deed in Gram Panchayat verified');
  }

  // Test 7: Gender neutrality test in Karnataka
  {
    const maleRes = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 5000000, guidanceValue: 0, buyerGender: 'male' });
    const femaleRes = BANGALORE_CALCULATOR.calculateBangaloreStampDuty({ agreementValue: 5000000, guidanceValue: 0, buyerGender: 'female' });
    assert.strictEqual(maleRes.totalStatutoryOutgo, femaleRes.totalStatutoryOutgo, 'Karnataka has no gender rebate for property registration');
    console.log('✓ Test 7 Passed: Karnataka gender-neutrality verified');
  }
}

module.exports = { runBangaloreTests };
if (require.main === module) {
  runBangaloreTests();
}
