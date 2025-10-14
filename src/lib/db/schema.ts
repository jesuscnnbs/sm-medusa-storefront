import { pgTable, text, timestamp, uuid, integer, boolean, json, varchar, unique } from 'drizzle-orm/pg-core'

// Admin Users table
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin').notNull(), // admin, super_admin
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Admin Sessions table for secure session management
export const adminSessions = pgTable('admin_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => adminUsers.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }), // Support IPv6
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastAccessAt: timestamp('last_access_at').defaultNow().notNull(),
})

// Rate limiting table for security
export const rateLimiting = pgTable('rate_limiting', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: varchar('identifier', { length: 255 }).notNull(), // IP address or email
  action: varchar('action', { length: 50 }).notNull(), // 'admin_login', etc.
  attempts: integer('attempts').default(1).notNull(),
  lastAttempt: timestamp('last_attempt').defaultNow().notNull(),
  lockedUntil: timestamp('locked_until'),
}, (table) => ({
  uniqueIdentifierAction: unique('rate_limiting_identifier_action_unique').on(table.identifier, table.action)
}))

// Menu Profiles table - allows multiple menu configurations
export const menuProfiles = pgTable('menu_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // e.g., "Menú Principal", "Menú de Temporada", "Menú Especial"
  nameEn: text('name_en'), // English translation
  description: text('description'),
  descriptionEn: text('description_en'), // English translation
  isActive: boolean('is_active').default(true).notNull(),
  isDefault: boolean('is_default').default(false).notNull(), // Only one can be default
  validFrom: timestamp('valid_from'), // Optional: menu validity period
  validTo: timestamp('valid_to'), // Optional: menu validity period
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Menu Categories table
export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEn: text('name_en'), // English translation
  description: text('description'),
  descriptionEn: text('description_en'), // English translation
  image: text('image'), // Category image URL
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Menu Items table for restaurant management
export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEn: text('name_en'), // English translation
  description: text('description'),
  descriptionEn: text('description_en'), // English translation
  price: integer('price').notNull(), // Price in cents
  categoryId: uuid('category_id').references(() => menuCategories.id),
  image: text('image'), // Image URL
  isAvailable: boolean('is_available').default(true).notNull(),
  isPopular: boolean('is_popular').default(false).notNull(),
  ingredients: json('ingredients').$type<string[]>(), // Array of ingredients
  allergens: json('allergens').$type<string[]>(), // Array of allergens
  nutritionalInfo: json('nutritional_info').$type<{
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }>(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Junction table for many-to-many relationship between menu profiles and menu items
export const menuProfileItems = pgTable('menu_profile_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuProfileId: uuid('menu_profile_id').references(() => menuProfiles.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(), // Order of item within this specific menu profile
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueMenuProfileItem: unique('menu_profile_items_profile_item_unique').on(table.menuProfileId, table.menuItemId)
}))

// Site Settings table for dynamic configuration
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  description: text('description'),
  type: text('type').default('string').notNull(), // string, number, boolean, json
  isPublic: boolean('is_public').default(false).notNull(), // Whether this setting can be accessed publicly
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})