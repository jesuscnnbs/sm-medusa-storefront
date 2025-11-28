import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Global setup for Playwright tests
 * This runs once before all tests to ensure the database is seeded
 */
export default async function globalSetup() {
  console.log('🌱 Setting up test environment...');

  // Verify DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.error('Please ensure .env.test exists with DATABASE_URL');
    throw new Error('DATABASE_URL not configured for tests');
  }

  console.log(`📍 Test database: ${process.env.DATABASE_URL.includes('neon.tech') ? 'NEON' : 'LOCAL'}`);

  try {
    // Push schema to test database first
    console.log('🔧 Pushing database schema...');
    const { stdout: schemaOutput } = await execAsync('npm run db:push-test');
    if (schemaOutput) {
      console.log(schemaOutput);
    }

    // Run the seed script to populate the database with test data
    console.log('📦 Seeding database with test data...');
    const { stdout, stderr } = await execAsync('npm run db:seed-test');

    if (stdout) {
      console.log(stdout);
    }

    if (stderr && !stderr.includes('DeprecationWarning')) {
      console.error('Seed script warnings:', stderr);
    }

    console.log('✅ Test environment setup complete!');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
}
