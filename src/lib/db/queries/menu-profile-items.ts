"use server"

import { eq, and, asc } from 'drizzle-orm'
import { db, schema } from '../index'
import type { NewMenuProfileItem } from '../index'

export async function addItemToMenuProfile(menuProfileId: string, menuItemId: string, sortOrder: number = 0) {
  const [association] = await db
    .insert(schema.menuProfileItems)
    .values({ 
      menuProfileId, 
      menuItemId, 
      sortOrder 
    })
    .returning()
  return association
}

export async function removeItemFromMenuProfile(menuProfileId: string, menuItemId: string) {
  const [association] = await db
    .delete(schema.menuProfileItems)
    .where(
      and(
        eq(schema.menuProfileItems.menuProfileId, menuProfileId),
        eq(schema.menuProfileItems.menuItemId, menuItemId)
      )
    )
    .returning()
  return association
}

export async function getMenuProfileItems(menuProfileId: string) {
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
      categoryId: schema.menuItems.categoryId,
      sortOrder: schema.menuProfileItems.sortOrder,
      associationId: schema.menuProfileItems.id,
      categoryName: schema.menuCategories.name,
      categoryNameEn: schema.menuCategories.nameEn,
    })
    .from(schema.menuProfileItems)
    .innerJoin(schema.menuItems, eq(schema.menuProfileItems.menuItemId, schema.menuItems.id))
    .leftJoin(schema.menuCategories, eq(schema.menuItems.categoryId, schema.menuCategories.id))
    .where(eq(schema.menuProfileItems.menuProfileId, menuProfileId))
    .orderBy(asc(schema.menuProfileItems.sortOrder), asc(schema.menuItems.name))
}

export async function updateMenuProfileItemSortOrder(menuProfileId: string, menuItemId: string, sortOrder: number) {
  const [association] = await db
    .update(schema.menuProfileItems)
    .set({ sortOrder })
    .where(
      and(
        eq(schema.menuProfileItems.menuProfileId, menuProfileId),
        eq(schema.menuProfileItems.menuItemId, menuItemId)
      )
    )
    .returning()
  return association
}

export async function setMenuProfileItems(menuProfileId: string, menuItemIds: string[]) {
  try {
    // Delete existing associations
    // Note: neon-http driver doesn't support transactions, so we do operations sequentially
    await db
      .delete(schema.menuProfileItems)
      .where(eq(schema.menuProfileItems.menuProfileId, menuProfileId))

    // Insert new associations if any
    if (menuItemIds.length > 0) {
      const associations = menuItemIds.map((menuItemId, index) => ({
        menuProfileId,
        menuItemId,
        sortOrder: index
      }))

      const inserted = await db
        .insert(schema.menuProfileItems)
        .values(associations)
        .returning()

      return { success: true, count: inserted.length }
    }

    return { success: true, count: 0 }
  } catch (error) {
    console.error('Error in setMenuProfileItems:', error)
    throw error
  }
}