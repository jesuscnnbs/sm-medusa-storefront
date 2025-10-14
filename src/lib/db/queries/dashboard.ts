"use server"

import { eq, count } from 'drizzle-orm'
import { db, schema } from './index'

export async function getDashboardStats() {
  try {
    const [menuItemsResult, categoriesResult, activeCategoriesResult, menuProfilesResult] = await Promise.all([
      db.select({ count: count() }).from(schema.menuItems),
      db.select({ count: count() }).from(schema.menuCategories),
      db.select({ count: count() }).from(schema.menuCategories).where(eq(schema.menuCategories.isActive, true)),
      db.select({ count: count() }).from(schema.menuProfiles),
    ])

    const menuItemsCount = menuItemsResult[0]?.count || 0
    const categoriesCount = categoriesResult[0]?.count || 0
    const activeCategoriesCount = activeCategoriesResult[0]?.count || 0
    const menuProfilesCount = menuProfilesResult[0]?.count || 0
    
    return {
      menuItemsCount,
      categoriesCount,
      activeCategoriesCount,
      menuProfilesCount,
    }
  } catch (e) {
    console.error("Error fetching dashboard stats:", e)
    return {
      menuItemsCount: 0,
      categoriesCount: 0,
      activeCategoriesCount: 0,
      menuProfilesCount: 0,
    }
  }
}