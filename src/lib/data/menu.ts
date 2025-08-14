"use server"

import { MenuItem, MenuCategoryType } from "../../types/global"
import { eq, and } from "drizzle-orm"

// Dynamic import based on environment to avoid edge runtime issues with pg
async function getDb() {
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
    // Production/Vercel: Use Vercel Postgres
    const { db, schema } = await import("@lib/db")
    return { db, schema }
  } else {
    // Local development: Use regular PostgreSQL with node-postgres
    const { drizzle } = await import("drizzle-orm/node-postgres")
    const { Pool } = await import("pg")
    const schema = await import("../db/schema")
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    })
    
    const db = drizzle(pool, { schema })
    return { db, schema }
  }
}

export const listMenuItems = async (locale: 'en' | 'es' = 'es', query?: Record<string, any>) => {
  try {
    const { db, schema } = await getDb()
    
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