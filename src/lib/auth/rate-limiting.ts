import { eq, and, lt } from 'drizzle-orm'

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

// Rate limiting configuration
const RATE_LIMITS = {
  admin_login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime?: Date
  lockoutTime?: Date
}

/**
 * Check and update rate limiting for a given identifier and action
 */
export async function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMITS
): Promise<RateLimitResult> {
  try {
    const { db, schema } = await getDb()
    const config = RATE_LIMITS[action]
    const now = new Date()
    const windowStart = new Date(now.getTime() - config.windowMs)

    // Clean up old entries
    await db
      .delete(schema.rateLimiting)
      .where(
        and(
          eq(schema.rateLimiting.action, action),
          lt(schema.rateLimiting.lastAttempt, windowStart),
          eq(schema.rateLimiting.lockedUntil, null)
        )
      )

    // Get current rate limit record
    const [record] = await db
      .select()
      .from(schema.rateLimiting)
      .where(
        and(
          eq(schema.rateLimiting.identifier, identifier),
          eq(schema.rateLimiting.action, action)
        )
      )
      .limit(1)

    // Check if currently locked out
    if (record?.lockedUntil && record.lockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        lockoutTime: record.lockedUntil
      }
    }

    // If no record or lockout expired, create/reset
    if (!record || (record.lockedUntil && record.lockedUntil <= now)) {
      await db
        .insert(schema.rateLimiting)
        .values({
          identifier,
          action,
          attempts: 1,
          lastAttempt: now,
          lockedUntil: null,
        })
        .onConflictDoUpdate({
          target: [schema.rateLimiting.identifier, schema.rateLimiting.action],
          set: {
            attempts: 1,
            lastAttempt: now,
            lockedUntil: null,
          }
        })

      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: new Date(now.getTime() + config.windowMs)
      }
    }

    // Check if within rate limit window
    const isWithinWindow = record.lastAttempt > windowStart
    
    if (!isWithinWindow) {
      // Reset counter if outside window
      await db
        .update(schema.rateLimiting)
        .set({
          attempts: 1,
          lastAttempt: now,
          lockedUntil: null,
        })
        .where(eq(schema.rateLimiting.id, record.id))

      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: new Date(now.getTime() + config.windowMs)
      }
    }

    // Increment attempts
    const newAttempts = record.attempts + 1
    const shouldLockout = newAttempts >= config.maxAttempts
    const lockoutUntil = shouldLockout 
      ? new Date(now.getTime() + config.lockoutMs) 
      : null

    await db
      .update(schema.rateLimiting)
      .set({
        attempts: newAttempts,
        lastAttempt: now,
        lockedUntil: lockoutUntil,
      })
      .where(eq(schema.rateLimiting.id, record.id))

    return {
      allowed: !shouldLockout,
      remaining: Math.max(0, config.maxAttempts - newAttempts),
      resetTime: new Date(now.getTime() + config.windowMs),
      lockoutTime: lockoutUntil || undefined
    }

  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open - allow request if rate limiting fails
    return {
      allowed: true,
      remaining: RATE_LIMITS[action].maxAttempts - 1
    }
  }
}

/**
 * Reset rate limiting for a successful action (e.g., successful login)
 */
export async function resetRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMITS
): Promise<void> {
  try {
    const { db, schema } = await getDb()
    
    await db
      .delete(schema.rateLimiting)
      .where(
        and(
          eq(schema.rateLimiting.identifier, identifier),
          eq(schema.rateLimiting.action, action)
        )
      )
  } catch (error) {
    console.error('Reset rate limiting error:', error)
  }
}