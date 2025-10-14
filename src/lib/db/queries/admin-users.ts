"use server"

import { eq, desc } from 'drizzle-orm'
import { db, schema } from './index'
import type { NewAdminUser } from './index'

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