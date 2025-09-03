import { lt, eq } from 'drizzle-orm'

// Dynamic import based on environment to avoid edge runtime issues
async function getDb() {
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
    // Production/Vercel: Use Vercel Postgres
    const { db, schema } = await import("@lib/db")
    return { db, schema }
  } else {
    // Local development: Use regular PostgreSQL with node-postgres
    const { drizzle } = await import("drizzle-orm/node-postgres")
    const { Pool } = await import("pg")
    const schema = await import("@lib/db/schema")
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    })
    
    const db = drizzle(pool, { schema })
    return { db, schema }
  }
}

/**
 * Clean up expired sessions and rate limiting records
 * Should be called periodically (e.g., via cron job)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const { db, schema } = await getDb()
    const now = new Date()

    // Clean up expired admin sessions
    const deletedSessions = await db
      .delete(schema.adminSessions)
      .where(lt(schema.adminSessions.expiresAt, now))

    // Clean up old rate limiting records (older than 24 hours)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const deletedRateLimit = await db
      .delete(schema.rateLimiting)
      .where(lt(schema.rateLimiting.lastAttempt, oneDayAgo))

    console.log(`Session cleanup completed: ${deletedSessions} sessions, ${deletedRateLimit} rate limit records removed`)
  } catch (error) {
    console.error('Session cleanup error:', error)
  }
}

/**
 * Invalidate all sessions for a specific user (e.g., on password change)
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  try {
    const { db, schema } = await getDb()
    
    await db
      .delete(schema.adminSessions)
      .where(eq(schema.adminSessions.userId, userId))

    console.log(`All sessions invalidated for user: ${userId}`)
  } catch (error) {
    console.error('User session invalidation error:', error)
  }
}