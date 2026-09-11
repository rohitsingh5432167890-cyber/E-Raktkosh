/**
 * e-RaktKosh Connect - Database Seeding / Reset CLI Script
 * Usage: npm run seed
 */

const {
  seed,
  Users,
  BloodBanks,
  Stocks,
  DonationCamps,
  EmergencyRequests
} = require('../config/db');

console.log('======================================================');
console.log('  e-RaktKosh Connect - Database Seeder & Reset CLI');
console.log('======================================================\n');

try {
  seed();

  console.log('\n[SUCCESS] Database successfully re-seeded with production-grade data:');
  console.log(`  - Users: ${Users.count()} accounts`);
  console.log(`  - Apex Blood Centers: ${BloodBanks.count()} licensed facilities`);
  console.log(`  - Blood Stock Matrix: ${Stocks.count()} stock records`);
  console.log(`  - Donation Camps: ${DonationCamps.count()} scheduled camps`);
  console.log(`  - Emergency Requests: ${EmergencyRequests.count()} active SOS cases`);
  console.log('\nReady for authentication and inventory management.\n');
  process.exit(0);
} catch (err) {
  console.error('\n[ERROR] Failed to seed database:', err);
  process.exit(1);
}
