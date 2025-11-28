/**
 * Global teardown for Playwright tests
 * Runs once after all tests complete
 */
import { closeDatabasePool } from './helpers/database'

export default async function globalTeardown() {
  console.log('🧹 Cleaning up test environment...')

  try {
    // Close database connection pool
    await closeDatabasePool()
    console.log('✅ Database connections closed')
  } catch (error) {
    console.error('⚠️  Error during teardown:', error)
  }
}
