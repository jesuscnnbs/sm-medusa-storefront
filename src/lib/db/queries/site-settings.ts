"use server"

import { eq, asc } from 'drizzle-orm'
import { db, schema } from '../index'
import type { NewSiteSetting } from '../index'

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