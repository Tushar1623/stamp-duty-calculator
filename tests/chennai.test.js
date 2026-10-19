/**
 * Unit and Regression Tests for Chennai (Tamil Nadu) Calculation Engine
 */

const assert = require('assert');
const { CHENNAI_CALCULATOR } = require('../chennai/js/core/calculator.js');

function runChennaiTests() {
  console.log('--- Running Chennai (Tamil Nadu) Engine Tests ---');

  // Test 1: Worked Financial Model from PDF - ₹1.00 Crore Standard Sale Deed
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 10000000,
      guidelineValue: 9000000,
      deedType: 'sale',
      buyerGender: 'male'
    });
    assert.strictEqual(res.chargeableVal, 10000000, 'Chargeable val should be max (1 Cr)');
    assert.strictEqual(res.valuationBasis, 'agreement');
    assert.strictEqual(res.stampDuty, 700000, 'Stamp duty must be ₹7,00,000 (7%)');
    assert.strictEqual(res.registrationFee, 400000, 'Registration fee must be ₹4,00,000 (4%)');
    assert.strictEqual(res.totalStatutoryOutgo, 1100000, 'Total statutory outgo must be ₹11,00,000 (11%)');
    assert.strictEqual(res.tdsApplicable, true, 'TDS must apply for >= 50 Lakhs');
    assert.strictEqual(res.tdsAmount, 100000, 'TDS must be ₹1,00,000 (1%)');
    console.log('✓ Test 1 Passed: ₹1 Cr standard sale deed matches PDF (11% total)');
  }

  // Test 2: Higher of Guideline Value vs Agreement Value
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 4000000,
      guidelineValue: 6000000,
      deedType: 'sale',
      buyerGender: 'male'
    });
    assert.strictEqual(res.chargeableVal, 6000000, 'Chargeable val must be guideline value (60L)');
    assert.strictEqual(res.valuationBasis, 'guideline');
    assert.strictEqual(res.stampDuty, 420000, '7% of 60L = ₹4,20,000');
    assert.strictEqual(res.registrationFee, 240000, '4% of 60L = ₹2,40,000');
    assert.strictEqual(res.totalStatutoryOutgo, 660000, 'Total = ₹6,60,000');
    console.log('✓ Test 2 Passed: Higher of Agreement Value vs Guideline Value applied correctly');
  }

  // Test 3: Sole Female Buyer Concession under ₹10 Lakhs (3% Registration Fee)
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 800000,
      guidelineValue: 800000,
      deedType: 'sale',
      buyerGender: 'female'
    });
    assert.strictEqual(res.isFemaleConcessionApplied, true);
    assert.strictEqual(res.stampDuty, 56000, '7% of 8L = ₹56,000');
    assert.strictEqual(res.registrationFee, 24000, '3% of 8L = ₹24,000 (concessional)');
    assert.strictEqual(res.totalStatutoryOutgo, 80000, 'Total 10% = ₹80,000');
    console.log('✓ Test 3 Passed: Female concession <= ₹10L applied correctly (3% reg fee, 10% total)');
  }

  // Test 4: Sole Female Buyer ABOVE ₹10 Lakhs (Does NOT qualify for 3% reg fee)
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 1500000,
      guidelineValue: 1200000,
      deedType: 'sale',
      buyerGender: 'female'
    });
    assert.strictEqual(res.isFemaleConcessionApplied, false);
    assert.strictEqual(res.registrationFee, 60000, '4% standard reg fee must apply above 10L');
    assert.strictEqual(res.totalStatutoryOutgo, 165000, '11% of 15L = ₹1,65,000');
    console.log('✓ Test 4 Passed: Female buyer above ₹10L correctly assessed standard 4% fee');
  }

  // Test 5: Family Gift Deed - Statutory Caps Verified (₹40,000 duty cap & ₹10,000 reg cap)
  {
    // Property valued at ₹1 Crore gifted to child
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 0,
      guidelineValue: 10000000,
      deedType: 'gift_family',
      buyerGender: 'male'
    });
    assert.strictEqual(res.stampDuty, 40000, 'Stamp duty capped at ₹40,000 under revised TN rules');
    assert.strictEqual(res.registrationFee, 10000, 'Registration fee capped at ₹10,000 under revised TN rules');
    assert.strictEqual(res.totalStatutoryOutgo, 50000, 'Total family gift charges capped at ₹50,000');
    assert.strictEqual(res.isFamilyCapped, true);
    console.log('✓ Test 5 Passed: Family gift deed caps verified (₹40k duty + ₹10k reg fee)');
  }

  // Test 6: Family Gift Deed Below Caps (e.g. ₹20 Lakhs)
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: 0,
      guidelineValue: 2000000,
      deedType: 'gift_family',
      buyerGender: 'male'
    });
    assert.strictEqual(res.stampDuty, 20000, '1% of 20L = ₹20,000 (below 40k cap)');
    assert.strictEqual(res.registrationFee, 20000 > 10000 ? 10000 : 20000, 'Registration fee capped at ₹10,000');
    assert.strictEqual(res.totalStatutoryOutgo, 30000, 'Total = ₹30,000');
    console.log('✓ Test 6 Passed: Family gift deed below stamp duty cap handled properly');
  }

  // Test 7: Zero and Invalid Input Handling
  {
    const res = CHENNAI_CALCULATOR.calculateChennaiStampDuty({
      agreementValue: -500,
      guidelineValue: 0,
      deedType: 'sale'
    });
    assert.strictEqual(res.chargeableVal, 0);
    assert.strictEqual(res.totalStatutoryOutgo, 0);
    assert.strictEqual(res.tdsApplicable, false);
    console.log('✓ Test 7 Passed: Invalid / zero inputs safely return zero total');
  }
}

module.exports = { runChennaiTests };
if (require.main === module) {
  runChennaiTests();
}
