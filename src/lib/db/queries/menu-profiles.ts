"use server"

import { eq, desc, asc } from 'drizzle-orm'
import { db, schema } from '../index'
import type { NewMenuProfile } from '../index'

export async function createMenuProfile(data: NewMenuProfile) {
  // If this menu should be active, deactivate all other menus first
  if (data.isActive) {
    await db
      .update(schema.menuProfiles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.menuProfiles.isActive, true))
  }

  const [profile] = await db.insert(schema.menuProfiles).values(data).returning()
  return profile
}

export async function getAllMenuProfiles() {
  return await db
    .select()
    .from(schema.menuProfiles)
    .orderBy(asc(schema.menuProfiles.createdAt))
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
  // If this menu should be active, deactivate all other menus first
  if (data.isActive) {
    await db
      .update(schema.menuProfiles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.menuProfiles.isActive, true))
  }

  const [profile] = await db
    .update(schema.menuProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.menuProfiles.id, id))
    .returning()
  return profile
}

export async function toggleMenuProfileActive(id: string) {
  const currentProfile = await getMenuProfileById(id)
  if (!currentProfile) {
    throw new Error('Menu profile not found')
  }

  if (!currentProfile.isActive) {
    await db
      .update(schema.menuProfiles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.menuProfiles.isActive, true))
  }

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

export async function deleteMenuProfile(id: string) {
  const [deletedProfile] = await db
    .delete(schema.menuProfiles)
    .where(eq(schema.menuProfiles.id, id))
    .returning()
  return deletedProfile
}