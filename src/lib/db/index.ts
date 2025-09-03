import { lt } from 'drizzle-orm'
import * as schema from './schema'

// Environment-specific database configuration
// Production: Use Neon serverless driver (edge-compatible)
// Local: Use PostgreSQL with node-postgres
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Dynamic import and connection based on environment
let db: any
let sql: any

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Production/Vercel: Use Neon serverless driver
  const { drizzle } = require('drizzle-orm/neon-http')
  const { neon } = require('@neondatabase/serverless')
  sql = neon(connectionString)
  db = drizzle(sql, { schema })
} else {
  // Local development: Use PostgreSQL with node-postgres
  const { drizzle } = require('drizzle-orm/node-postgres')
  const { Pool } = require('pg')
  const pool = new Pool({
    connectionString: connectionString,
    max: 10,
  })
  db = drizzle(pool, { schema })
  sql = pool
}

export { db }

// Export schema for easy access
export { schema }

// Database transaction type helper
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Helper para validar conexión
export async function testDbConnection(): Promise<boolean> {
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      // Neon: direct function call
      await sql('SELECT 1')
    } else {
      // PostgreSQL: query method
      await sql.query('SELECT 1')
    }
    return true
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error)
    return false
  }
}

// Helper para limpiar sesiones expiradas (tarea de mantenimiento)
export async function cleanExpiredSessions(): Promise<void> {
  try {
    await db
      .delete(schema.adminSessions)
      .where(lt(schema.adminSessions.expiresAt, new Date()))
  } catch (error) {
    console.error('Error limpiando sesiones expiradas:', error)
  }
}

// Export types inferred from schema
export type AdminUser = typeof schema.adminUsers.$inferSelect
export type NewAdminUser = typeof schema.adminUsers.$inferInsert

export type AdminSession = typeof schema.adminSessions.$inferSelect
export type NewAdminSession = typeof schema.adminSessions.$inferInsert

export type MenuProfile = typeof schema.menuProfiles.$inferSelect
export type NewMenuProfile = typeof schema.menuProfiles.$inferInsert

export type MenuCategory = typeof schema.menuCategories.$inferSelect
export type NewMenuCategory = typeof schema.menuCategories.$inferInsert

export type MenuItem = typeof schema.menuItems.$inferSelect
export type NewMenuItem = typeof schema.menuItems.$inferInsert

export type SiteSetting = typeof schema.siteSettings.$inferSelect
export type NewSiteSetting = typeof schema.siteSettings.$inferInsert