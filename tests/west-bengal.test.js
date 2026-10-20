/**
 * West Bengal Stamp Duty & Registration Engine Test Suite
 * Validates calculations against West Bengal Stamp (Amendment) Act & IGR WB rules
 */

const assert = require('assert');
const { calculateWbStampDuty } = require('../assets/js/calculators/west-bengal.js').WB_CALCULATOR;

function runWestBengalTests() {
  console.log('--- Running West Bengal Engine Tests ---');

  // Test 1: Urban standard sale deed (₹50 Lakhs, Male)
  // Base duty 6% = ₹3,00,000; Reg fee 1.1% = ₹55,000; Total = ₹3,55,000
  {
    const res = calculateWbStampDuty({
      propertyValue: 5000000,
      zone: 'urban',
      deedType: 'sale',
      buyerGender: 'male'
    });

    assert.strictEqual(res.baseDuty, 300000, 'Urban 6% base duty on ₹50L should be ₹3,00,000');
    assert.strictEqual(res.hasSurcharge, false, 'No surcharge under ₹1 Crore');
    assert.strictEqual(res.surchargeAmt, 0, 'Surcharge amount should be 0');
    assert.strictEqual(res.hasGenderRebate, false, 'Male buyer gets no gender rebate');
    assert.strictEqual(res.totalDuty, 300000, 'Total duty should be ₹3,00,000');
    assert.strictEqual(res.regFee, 55000, '1.1% reg fee on ₹50L should be ₹55,000');
    assert.strictEqual(res.totalPayable, 355000, 'Total payable should be ₹3,55,000');
    console.log('✓ Test 1 Passed: Urban standard sale deed (₹50 Lakhs) verified (6% duty + 1.1% reg)');
  }

  // Test 2: Rural standard sale deed (₹50 Lakhs, Male)
  // Base duty 5% = ₹2,50,000; Reg fee 1.1% = ₹55,000; Total = ₹3,05,000
  {
    const res = calculateWbStampDuty({
      propertyValue: 5000000,
      zone: 'rural',
      deedType: 'sale',
      buyerGender: 'male'
    });

    assert.strictEqual(res.baseDuty, 250000, 'Rural 5% base duty on ₹50L should be ₹2,50,000');
    assert.strictEqual(res.totalDuty, 250000, 'Total duty should be ₹2,50,000');
    assert.strictEqual(res.regFee, 55000, '1.1% reg fee should be ₹55,000');
    assert.strictEqual(res.totalPayable, 305000, 'Total payable should be ₹3,05,000');
    console.log('✓ Test 2 Passed: Rural standard sale deed (₹50 Lakhs) verified (5% duty + 1.1% reg)');
  }

  // Test 3: High-Value Surcharge (> ₹1 Crore) in Urban Zone (₹1.5 Crore, Male)
  // Base duty 6% = ₹9,00,000; Surcharge 1% = ₹1,50,000; Total duty 7% = ₹10,50,000; Reg fee 1.1% = ₹1,65,000; Total = ₹12,15,000
  {
    const res = calculateWbStampDuty({
      propertyValue: 15000000,
      zone: 'urban',
      deedType: 'sale',
      buyerGender: 'male'
    });

    assert.strictEqual(res.baseDuty, 900000, 'Base duty 6% on ₹1.5 Cr should be ₹9,00,000');
    assert.strictEqual(res.hasSurcharge, true, 'Surcharge applies above ₹1 Crore');
    assert.strictEqual(res.surchargeAmt, 150000, '1% surcharge on ₹1.5 Cr should be ₹1,50,000');
    assert.strictEqual(res.totalDuty, 1050000, 'Total duty (6% + 1% = 7%) should be ₹10,50,000');
    assert.strictEqual(res.regFee, 165000, '1.1% reg fee on ₹1.5 Cr should be ₹1,65,000');
    assert.strictEqual(res.totalPayable, 1215000, 'Total payable should be ₹12,15,000');
    console.log('✓ Test 3 Passed: Urban high-value surcharge on ₹1.5 Cr verified (7% duty + 1.1% reg)');
  }

  // Test 4: Women buyer 1% rebate (₹50 Lakhs, Female, Urban)
  // Base duty 6% = ₹3,00,000; Rebate -1% = ₹50,000; Total duty = ₹2,50,000; Reg fee = ₹55,000; Total = ₹3,05,000
  {
    const res = calculateWbStampDuty({
      propertyValue: 5000000,
      zone: 'urban',
      deedType: 'sale',
      buyerGender: 'female'
    });

    assert.strictEqual(res.hasGenderRebate, true, 'Female buyer receives 1% rebate');
    assert.strictEqual(res.rebateAmt, 50000, '1% rebate on ₹50L should be ₹50,000');
    assert.strictEqual(res.totalDuty, 250000, 'Effective duty (5%) should be ₹2,50,000');
    assert.strictEqual(res.regFee, 55000, '1.1% reg fee should be ₹55,000');
    assert.strictEqual(res.totalPayable, 305000, 'Total payable should be ₹3,05,000');
    console.log('✓ Test 4 Passed: Women buyer 1% rebate verified (5% effective duty + 1.1% reg)');
  }

  // Test 5: Blood Relative Gift Deed (₹80 Lakhs)
  // Flat 0.5% duty = ₹40,000; Reg fee 1.1% = ₹88,000; Total = ₹1,28,000
  {
    const res = calculateWbStampDuty({
      propertyValue: 8000000,
      zone: 'urban',
      deedType: 'gift_relative',
      buyerGender: 'male'
    });

    assert.strictEqual(res.baseDuty, 40000, '0.5% flat duty on ₹80L should be ₹40,000');
    assert.strictEqual(res.hasSurcharge, false, 'No surcharge on blood relative gift');
    assert.strictEqual(res.totalDuty, 40000, 'Total duty should be ₹40,000');
    assert.strictEqual(res.regFee, 88000, '1.1% reg fee on ₹80L should be ₹88,000');
    assert.strictEqual(res.totalPayable, 128000, 'Total payable should be ₹1,28,000');
    console.log('✓ Test 5 Passed: Blood relative gift deed verified (0.5% flat duty + 1.1% reg)');
  }

  // Test 6: Blood Relative Gift Deed > ₹1 Crore (₹2 Crore) — Confirms NO surcharge applies
  {
    const res = calculateWbStampDuty({
      propertyValue: 20000000,
      zone: 'urban',
      deedType: 'gift_relative',
      buyerGender: 'male'
    });

    assert.strictEqual(res.baseDuty, 100000, '0.5% flat duty on ₹2 Cr should be ₹1,00,000');
    assert.strictEqual(res.hasSurcharge, false, 'Blood relative gift is exempt from surcharge regardless of value');
    assert.strictEqual(res.totalDuty, 100000, 'Total duty should be ₹1,00,000');
    assert.strictEqual(res.regFee, 220000, '1.1% reg fee on ₹2 Cr should be ₹2,20,000');
    assert.strictEqual(res.totalPayable, 320000, 'Total payable should be ₹3,20,000');
    console.log('✓ Test 6 Passed: High-value blood relative gift strictly exempt from surcharge');
  }

  // Test 7: General Power of Attorney (POA)
  // Flat duty ₹1,000 + flat reg ₹200 = ₹1,200
  {
    const res = calculateWbStampDuty({
      propertyValue: 5000000,
      zone: 'urban',
      deedType: 'poa',
      buyerGender: 'male'
    });

    assert.strictEqual(res.totalDuty, 1000, 'POA flat stamp duty should be ₹1,000');
    assert.strictEqual(res.regFee, 200, 'POA flat registration fee should be ₹200');
    assert.strictEqual(res.totalPayable, 1200, 'POA total payable should be ₹1,200');
    console.log('✓ Test 7 Passed: General POA flat fees verified (₹1,000 duty + ₹200 reg)');
  }

  // Test 8: Zero / Invalid inputs safe handling
  {
    const resZero = calculateWbStampDuty({ propertyValue: 0 });
    assert.strictEqual(resZero.totalPayable, 0, 'Zero property value returns zero total');
    const resNeg = calculateWbStampDuty({ propertyValue: -5000 });
    assert.strictEqual(resNeg.totalPayable, 0, 'Negative property value returns zero total');
    console.log('✓ Test 8 Passed: Zero and negative inputs safely return zero total');
  }
}

module.exports = { runWestBengalTests };

if (require.main === module) {
  runWestBengalTests();
}
