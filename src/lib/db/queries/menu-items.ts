"use server"

import { eq, asc, and } from 'drizzle-orm'
import { db, schema } from '../index'
import type { NewMenuItem } from '../index'
import { MenuItem, MenuCategoryType } from "../../../types/global"

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

export async function listMenuItems(locale: 'en' | 'es' = 'es', query?: Record<string, any>) {
  try {
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

    return transformToCategoryStructure(menuItems, locale)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return []
  }
}

function transformToCategoryStructure(items: any[], locale: 'en' | 'es' = 'es'): MenuCategoryType[] {
  const categoriesMap = new Map<string, MenuCategoryType>();
  
  items.forEach(item => {
    const categoryId = item.categoryId;
    
    if (!categoryId) return;
    
    const categoryTitle = locale === 'en' 
      ? (item.categoryNameEn || item.categoryName || 'Uncategorized')
      : (item.categoryName || 'Sin categoría');
    
    const categoryDesc = locale === 'en'
      ? (item.categoryDescriptionEn || item.categoryDescription || '')
      : (item.categoryDescription || '');
    
    if (!categoriesMap.has(categoryId)) {
      categoriesMap.set(categoryId, {
        id: categoryId,
        title: categoryTitle,
        description: categoryDesc,
        items: []
      });
    }
    
    const itemTitle = locale === 'en'
      ? (item.nameEn || item.name || 'Unnamed')
      : (item.name || 'Sin nombre');
      
    const itemDesc = locale === 'en'
      ? (item.descriptionEn || item.description || '')
      : (item.description || '');
    
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
          items: []
        }
      });
    }
  });
  
  return Array.from(categoriesMap.values()).sort((a, b) => {
    const aFirstItem = items.find(item => item.categoryId === a.id);
    const bFirstItem = items.find(item => item.categoryId === b.id);
    const aSortOrder = aFirstItem?.categorySortOrder || 0;
    const bSortOrder = bFirstItem?.categorySortOrder || 0;
    return aSortOrder - bSortOrder;
  });
}