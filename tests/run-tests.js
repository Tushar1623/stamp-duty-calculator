/**
 * Master Test Runner for StampDutyCalc.in
 * Executes test suites across all supported calculation engines (West Bengal, Maharashtra, Delhi)
 */

const { runWestBengalTests } = require('./west-bengal.test.js');
const { runDelhiTests } = require('./delhi.test.js');
const { runMaharashtraTests } = require('./maharashtra.test.js');

console.log('================================================================');
console.log(' StampDutyCalc.in - Multi-Jurisdiction Engine Test Suite');
console.log(' Supported: West Bengal, Maharashtra, Delhi (NCT)');
console.log('================================================================\n');

try {
  require('./nav-structure.test.js');
  console.log('');
  runWestBengalTests();
  console.log('');
  runDelhiTests();
  console.log('');
  runMaharashtraTests();
  console.log('\n================================================================');
  console.log(' ALL TESTS PASSED SUCCESSFULLY! (0 Failures)');
  console.log('================================================================');
} catch (err) {
  console.error('\n❌ TEST SUITE FAILED:', err.message);
  console.error(err.stack);
  process.exit(1);
}
