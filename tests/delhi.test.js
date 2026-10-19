/**
 * Unit and Regression Tests for Delhi (NCT) Calculation Engine
 */

const assert = require('assert');
const { DELHI_CALCULATOR } = require('../delhi/js/core/calculator.js');

function runDelhiTests() {
  console.log('--- Running Delhi (NCT) Engine Tests ---');

  // Test 1: Worked Financial Model from PDF - ₹1.00 Crore Residential Acquisition in MCD Limits
  // A. Sole Female Purchaser (PDF expected: ₹5,00,000 duty + ₹1,00,000 reg = ₹6,00,000)
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 10000000,
      circleRateValue: 8000000,
      buyerGender: 'female',
      municipalArea: 'mcd',
      deedType: 'sale'
    });
    assert.strictEqual(res.stateStampDuty, 200000, '2% State Duty on ₹1 Cr = ₹2,00,000');
    assert.strictEqual(res.mcdTransferDuty, 300000, '3% MCD Transfer Duty (>25L for female) = ₹3,00,000');
    assert.strictEqual(res.totalStampDuty, 500000, 'Total Stamp Duty = ₹5,00,000 (5%)');
    assert.strictEqual(res.registrationFee, 100000, '1% Registration Fee = ₹1,00,000');
    // Note: includes ₹100 standard Sub-Registrar pasting fee
    assert.strictEqual(res.totalStatutoryOutgo, 600100, 'Total Outgo = ₹6,00,100 (matches PDF ₹6.00 Lakh model + ₹100 fee)');
    assert.strictEqual(res.femaleRebateSavings, 200000, 'Female buyer saves ₹2,00,000 compared to male purchaser');
    console.log('✓ Test 1A Passed: Delhi ₹1 Cr Sole Female matches PDF (5% duty + 1% reg)');
  }

  // B. Joint (Husband & Wife) (PDF expected: ₹6,00,000 duty + ₹1,00,000 reg = ₹7,00,000)
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 10000000,
      circleRateValue: 8000000,
      buyerGender: 'joint',
      municipalArea: 'mcd',
      deedType: 'sale'
    });
    assert.strictEqual(res.stateStampDuty, 250000, '2.5% State Duty on ₹1 Cr = ₹2,50,000');
    assert.strictEqual(res.mcdTransferDuty, 350000, '3.5% MCD Transfer Duty = ₹3,50,000');
    assert.strictEqual(res.totalStampDuty, 600000, 'Total Stamp Duty = ₹6,00,000 (6%)');
    assert.strictEqual(res.registrationFee, 100000, '1% Registration Fee = ₹1,00,000');
    assert.strictEqual(res.totalStatutoryOutgo, 700100, 'Total Outgo = ₹7,00,100 (matches PDF ₹7.00 Lakh model + ₹100 fee)');
    console.log('✓ Test 1B Passed: Delhi ₹1 Cr Joint (Husband & Wife) matches PDF (6% duty + 1% reg)');
  }

  // C. Sole Male Purchaser (PDF expected: ₹7,00,000 duty + ₹1,00,000 reg = ₹8,00,000)
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 10000000,
      circleRateValue: 8000000,
      buyerGender: 'male',
      municipalArea: 'mcd',
      deedType: 'sale'
    });
    assert.strictEqual(res.stateStampDuty, 300000, '3% State Duty on ₹1 Cr = ₹3,00,000');
    assert.strictEqual(res.mcdTransferDuty, 400000, '4% MCD Transfer Duty (>25L for male) = ₹4,00,000');
    assert.strictEqual(res.totalStampDuty, 700000, 'Total Stamp Duty = ₹7,00,000 (7%)');
    assert.strictEqual(res.registrationFee, 100000, '1% Registration Fee = ₹1,00,000');
    assert.strictEqual(res.totalStatutoryOutgo, 800100, 'Total Outgo = ₹8,00,100 (matches PDF ₹8.00 Lakh model + ₹100 fee)');
    assert.strictEqual(res.tdsApplicable, true, 'TDS must apply for >= ₹50L');
    assert.strictEqual(res.tdsAmount, 100000, '1% TDS = ₹1,00,000');
    console.log('✓ Test 1C Passed: Delhi ₹1 Cr Sole Male matches PDF (7% duty + 1% reg)');
  }

  // Test 2: Properties Valued Up to ₹25 Lakhs (Standard MCD duty without +1% surcharge)
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 2000000,
      circleRateValue: 2000000,
      buyerGender: 'male',
      municipalArea: 'mcd',
      deedType: 'sale'
    });
    assert.strictEqual(res.stateStampDuty, 60000, '3% State Duty on 20L = ₹60,000');
    assert.strictEqual(res.mcdTransferDuty, 60000, '3% MCD Duty on 20L (sub-25L) = ₹60,000');
    assert.strictEqual(res.totalStampDuty, 120000, 'Total duty = ₹1,20,000 (6%)');
    assert.strictEqual(res.registrationFee, 20000, '1% Registration = ₹20,000');
    console.log('✓ Test 2 Passed: Delhi <= ₹25L properties correctly use unrevised MCD duty (3% male)');
  }

  // Test 3: NDMC / Cantonment Board Area (No MCD Transfer Duty)
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 5000000,
      circleRateValue: 4000000,
      buyerGender: 'male',
      municipalArea: 'ndmc_cantt',
      deedType: 'sale'
    });
    assert.strictEqual(res.stateStampDuty, 150000, '3% State Duty = ₹1,50,000');
    assert.strictEqual(res.mcdTransferDuty, 0, 'NDMC / Cantt has 0% MCD transfer duty');
    assert.strictEqual(res.totalStampDuty, 150000);
    assert.strictEqual(res.registrationFee, 50000, '1% Registration = ₹50,000');
    console.log('✓ Test 3 Passed: NDMC / Cantonment area correctly excludes MCD transfer duty');
  }

  // Test 4: Delhi Gift Deed Assessment
  {
    const res = DELHI_CALCULATOR.calculateDelhiStampDuty({
      agreementValue: 0,
      circleRateValue: 6000000,
      buyerGender: 'female',
      municipalArea: 'mcd',
      deedType: 'gift'
    });
    // In Delhi, gift deed is taxed as conveyance by donee gender
    assert.strictEqual(res.stateStampDuty, 120000, '2% State Duty for female donee');
    assert.strictEqual(res.mcdTransferDuty, 180000, '3% MCD Transfer Duty (>25L)');
    assert.strictEqual(res.registrationFee, 60000, '1% Registration = ₹60,000');
    console.log('✓ Test 4 Passed: Delhi Gift Deed properly assesses donee conveyance rates');
  }
}

module.exports = { runDelhiTests };
if (require.main === module) {
  runDelhiTests();
}
