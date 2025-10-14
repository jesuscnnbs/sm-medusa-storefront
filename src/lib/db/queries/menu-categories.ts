"use server"

import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../index'
import type { NewMenuCategory } from '../index'

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