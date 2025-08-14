import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import { lt } from 'drizzle-orm'
import * as schema from './schema'

// Always use Vercel Postgres for edge compatibility
// For local development, set DATABASE_URL in .env.local pointing to your local PostgreSQL
// For production, Vercel will automatically provide POSTGRES_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required')
}

// Create the database connection using Vercel Postgres (edge-compatible)
export const db = drizzle(sql, { schema })

// Export schema for easy access
export { schema }

// Database transaction type helper
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Helper para validar conexión
export async function testDbConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
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