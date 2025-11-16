import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Global setup for Playwright tests
 * This runs once before all tests to ensure the database is seeded
 */
export default async function globalSetup() {
  console.log('🌱 Setting up test environment...');

  try {
    // Run the seed script to populate the database with test data
    console.log('📦 Seeding database with test data...');
    const { stdout, stderr } = await execAsync('npm run db:seed');

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error('Seed script warnings:', stderr);
    }

    console.log('✅ Test environment setup complete!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
}
