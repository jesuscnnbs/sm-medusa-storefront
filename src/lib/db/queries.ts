"use server"

import { eq, desc, asc } from 'drizzle-orm'
import { db, schema } from './index'
import type { 
  NewAdminUser, 
  NewMenuCategory, 
  NewMenuItem, 
  NewSiteSetting 
} from './index'

// Admin Users
export async function createAdminUser(data: NewAdminUser) {
  const [user] = await db.insert(schema.adminUsers).values(data).returning()
  return user
}

export async function getAdminUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1)
  return user
}

export async function getAllAdminUsers() {
  return await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.isActive, true))
    .orderBy(desc(schema.adminUsers.createdAt))
}

// Menu Categories
export async function createMenuCategory(data: NewMenuCategory) {
  const [category] = await db.insert(schema.menuCategories).values(data).returning()
  return category
}

export async function getAllMenuCategories() {
  return await db
    .select()
    .from(schema.menuCategories)
    .where(eq(schema.menuCategories.isActive, true))
    .orderBy(asc(schema.menuCategories.sortOrder))
}

export async function updateMenuCategory(id: string, data: Partial<NewMenuCategory>) {
  const [category] = await db
    .update(schema.menuCategories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.menuCategories.id, id))
    .returning()
  return category
}

export async function deleteMenuCategory(id: string) {
  const [category] = await db
    .update(schema.menuCategories)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(schema.menuCategories.id, id))
    .returning()
  return category
}

// Menu Items
export async function createMenuItem(data: NewMenuItem) {
  const [item] = await db.insert(schema.menuItems).values(data).returning()
  return item
}

export async function getAllMenuItems() {
  return await db
    .select({
      id: schema.menuItems.id,
      name: schema.menuItems.name,
      nameEn: schema.menuItems.nameEn,
      description: schema.menuItems.description,
      descriptionEn: schema.menuItems.descriptionEn,
      price: schema.menuItems.price,
      image: schema.menuItems.image,
      isAvailable: schema.menuItems.isAvailable,
      isPopular: schema.menuItems.isPopular,
      ingredients: schema.menuItems.ingredients,
      allergens: schema.menuItems.allergens,
      nutritionalInfo: schema.menuItems.nutritionalInfo,
      sortOrder: schema.menuItems.sortOrder,
      createdAt: schema.menuItems.createdAt,
      updatedAt: schema.menuItems.updatedAt,
      category: {
        id: schema.menuCategories.id,
        name: schema.menuCategories.name,
        nameEn: schema.menuCategories.nameEn,
      }
    })
    .from(schema.menuItems)
    .leftJoin(schema.menuCategories, eq(schema.menuItems.categoryId, schema.menuCategories.id))
    .orderBy(asc(schema.menuItems.sortOrder))
}

export async function getMenuItemsByCategory(categoryId: string) {
  return await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.categoryId, categoryId))
    .orderBy(asc(schema.menuItems.sortOrder))
}

export async function updateMenuItem(id: string, data: Partial<NewMenuItem>) {
  const [item] = await db
    .update(schema.menuItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.menuItems.id, id))
    .returning()
  return item
}

export async function deleteMenuItem(id: string) {
  const [item] = await db
    .delete(schema.menuItems)
    .where(eq(schema.menuItems.id, id))
    .returning()
  return item
}

// Site Settings
export async function createSiteSetting(data: NewSiteSetting) {
  const [setting] = await db.insert(schema.siteSettings).values(data).returning()
  return setting
}

export async function getSiteSetting(key: string) {
  const [setting] = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, key))
    .limit(1)
  return setting
}

export async function getAllSiteSettings() {
  return await db
    .select()
    .from(schema.siteSettings)
    .orderBy(asc(schema.siteSettings.key))
}

export async function getPublicSiteSettings() {
  return await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.isPublic, true))
    .orderBy(asc(schema.siteSettings.key))
}

export async function updateSiteSetting(key: string, value: string) {
  const [setting] = await db
    .update(schema.siteSettings)
    .set({ value, updatedAt: new Date() })
    .where(eq(schema.siteSettings.key, key))
    .returning()
  return setting
}

export async function upsertSiteSetting(data: NewSiteSetting) {
  const existing = await getSiteSetting(data.key)
  
  if (existing) {
    return updateSiteSetting(data.key, data.value)
  } else {
    return createSiteSetting(data)
  }
}