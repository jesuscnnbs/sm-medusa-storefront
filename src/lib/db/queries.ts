"use server"

import { eq, desc, asc, and, count } from 'drizzle-orm'
import { db, schema } from './index'
import type { 
  NewAdminUser, 
  NewMenuCategory, 
  NewMenuItem, 
  NewSiteSetting,
  NewMenuProfile
} from './index'
import { MenuItem, MenuCategoryType } from "../../types/global"

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

export async function getMenuItemById(id: string) {
  const [item] = await db
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
      categoryId: schema.menuItems.categoryId,
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
    .where(eq(schema.menuItems.id, id))
    .limit(1)
  return item
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

// Menu Profiles
export async function getAllMenuProfiles() {
  return await db
    .select()
    .from(schema.menuProfiles)
    .orderBy(desc(schema.menuProfiles.isActive), asc(schema.menuProfiles.sortOrder))
}

export async function getMenuProfileById(id: string) {
  const [profile] = await db
    .select()
    .from(schema.menuProfiles)
    .where(eq(schema.menuProfiles.id, id))
    .limit(1)
  return profile
}

export async function updateMenuProfile(id: string, data: Partial<NewMenuProfile>) {
  const [profile] = await db
    .update(schema.menuProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.menuProfiles.id, id))
    .returning()
  return profile
}

export async function toggleMenuProfileActive(id: string) {
  // First, get the current profile
  const currentProfile = await getMenuProfileById(id)
  if (!currentProfile) {
    throw new Error('Menu profile not found')
  }

  // If we're activating this profile, deactivate all others first
  if (!currentProfile.isActive) {
    await db
      .update(schema.menuProfiles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.menuProfiles.isActive, true))
  }

  // Toggle the current profile
  const [updatedProfile] = await db
    .update(schema.menuProfiles)
    .set({ 
      isActive: !currentProfile.isActive, 
      updatedAt: new Date() 
    })
    .where(eq(schema.menuProfiles.id, id))
    .returning()

  return updatedProfile
}

// Dashboard and Frontend Functions
export async function getDashboardStats() {
  try {
    // Fetch counts for various entities
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

export async function listMenuItems(locale: 'en' | 'es' = 'es', query?: Record<string, any>) {
  try {
    // Fetch menu items with their categories from the database
    const menuItems = await db
      .select({
        id: schema.menuItems.id,
        name: schema.menuItems.name,
        nameEn: schema.menuItems.nameEn,
        description: schema.menuItems.description,
        descriptionEn: schema.menuItems.descriptionEn,
        price: schema.menuItems.price,
        image: schema.menuItems.image,
        ingredients: schema.menuItems.ingredients,
        allergens: schema.menuItems.allergens,
        isAvailable: schema.menuItems.isAvailable,
        isPopular: schema.menuItems.isPopular,
        sortOrder: schema.menuItems.sortOrder,
        categoryId: schema.menuItems.categoryId,
        categoryName: schema.menuCategories.name,
        categoryNameEn: schema.menuCategories.nameEn,
        categoryDescription: schema.menuCategories.description,
        categoryDescriptionEn: schema.menuCategories.descriptionEn,
        categorySortOrder: schema.menuCategories.sortOrder,
      })
      .from(schema.menuItems)
      .leftJoin(
        schema.menuCategories,
        eq(schema.menuItems.categoryId, schema.menuCategories.id)
      )
      .leftJoin(
        schema.menuProfiles,
        eq(schema.menuItems.menuProfileId, schema.menuProfiles.id)
      )
      .where(
        and(
          eq(schema.menuItems.isAvailable, true),
          eq(schema.menuCategories.isActive, true),
          eq(schema.menuProfiles.isActive, true)
        )
      )
      .orderBy(schema.menuCategories.sortOrder, schema.menuItems.sortOrder)

    // Transform to match the expected structure
    return transformToCategoryStructure(menuItems, locale)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
}

function transformToCategoryStructure(items: any[], locale: 'en' | 'es' = 'es'): MenuCategoryType[] {
  // Use a Map to group items by category
  const categoriesMap = new Map<string, MenuCategoryType>();
  
  items.forEach(item => {
    const categoryId = item.categoryId;
    
    if (!categoryId) return; // Skip items without category
    
    // Get localized category name and description
    const categoryTitle = locale === 'en' 
      ? (item.categoryNameEn || item.categoryName || 'Uncategorized')
      : (item.categoryName || 'Sin categoría');
    
    const categoryDesc = locale === 'en'
      ? (item.categoryDescriptionEn || item.categoryDescription || '')
      : (item.categoryDescription || '');
    
    // If the category is not yet in our map, add it
    if (!categoriesMap.has(categoryId)) {
      categoriesMap.set(categoryId, {
        id: categoryId,
        title: categoryTitle,
        description: categoryDesc,
        items: []
      });
    }
    
    // Get localized item name and description
    const itemTitle = locale === 'en'
      ? (item.nameEn || item.name || 'Unnamed')
      : (item.name || 'Sin nombre');
      
    const itemDesc = locale === 'en'
      ? (item.descriptionEn || item.description || '')
      : (item.description || '');
    
    // Add the current item to its category
    const categoryGroup = categoriesMap.get(categoryId);
    if (categoryGroup) {
      categoryGroup.items.push({
        id: item.id,
        isNotActive: !item.isAvailable,
        title: itemTitle,
        description: itemDesc,
        image: item.image || '',
        price: item.price,
        ingredients: item.ingredients,
        allergens: item.allergens,
        isPopular: item.isPopular,
        category_id: categoryId,
        category: {
          id: categoryId,
          title: categoryTitle,
          description: categoryDesc,
          items: [] // Will be populated later
        }
      });
    }
  });
  
  // Convert the map values to an array and sort by category order
  return Array.from(categoriesMap.values()).sort((a, b) => {
    // Find the sort order from the first item in each category
    const aFirstItem = items.find(item => item.categoryId === a.id);
    const bFirstItem = items.find(item => item.categoryId === b.id);
    const aSortOrder = aFirstItem?.categorySortOrder || 0;
    const bSortOrder = bFirstItem?.categorySortOrder || 0;
    return aSortOrder - bSortOrder;
  });
}

export async function listMenuCategories() {
  try {
    const categories = await db
      .select({
        id: schema.menuCategories.id,
        name: schema.menuCategories.name,
        nameEn: schema.menuCategories.nameEn,
        description: schema.menuCategories.description,
        descriptionEn: schema.menuCategories.descriptionEn,
        image: schema.menuCategories.image,
        sortOrder: schema.menuCategories.sortOrder,
        isActive: schema.menuCategories.isActive,
        createdAt: schema.menuCategories.createdAt,
        updatedAt: schema.menuCategories.updatedAt
      })
      .from(schema.menuCategories)
      .orderBy(schema.menuCategories.sortOrder, schema.menuCategories.name)

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}