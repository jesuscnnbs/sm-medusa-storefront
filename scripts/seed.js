#!/usr/bin/env node

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const { readFileSync } = require('fs')
const { join } = require('path')
const seedData = require('./seed-data')

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development'
const envFile = nodeEnv === 'test' ? '.env.test' : '.env.local'

console.log(`📂 Loading environment from: ${envFile}`)

try {
  const envContent = readFileSync(join(process.cwd(), envFile), 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return

    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      process.env[key.trim()] = value.trim()
    }
  })
  console.log(`✓ Loaded ${envFile}`)
} catch (error) {
  console.warn(`⚠️  Could not load ${envFile}: ${error.message}`)
  console.log('   Continuing with existing environment variables...')
}

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables')
    process.exit(1)
  }

  // Prevent accidental production seeding
  // Allow seeding if NODE_ENV is 'test' (for testing databases)
  const isTestEnv = process.env.NODE_ENV === 'test'
  const isNeonDb = databaseUrl.includes('neon.tech')
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction || (isNeonDb && !isTestEnv)) {
    console.error('❌ DANGER: This script will DELETE ALL DATA!')
    console.error('❌ Cannot run seed script against production/non-test Neon database')
    console.error('❌ Use db:seed-neon script instead if you really need to seed production')
    console.error(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
    console.error(`   Database: ${isNeonDb ? 'NEON' : 'LOCAL'}`)
    process.exit(1)
  }

  console.log('🌱 Starting database seeding...')
  console.log('📍 Environment:', process.env.NODE_ENV || 'development')
  console.log('📍 Database:', databaseUrl.includes('localhost') ? 'LOCAL' : isNeonDb ? 'NEON (TEST)' : 'REMOTE')

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    connectionTimeoutMillis: 5000,
  })

  try {
    const client = await pool.connect()

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await client.query('TRUNCATE TABLE menu_profile_items, menu_items, menu_categories, menu_profiles, admin_sessions, admin_users, site_settings, rate_limiting RESTART IDENTITY CASCADE')

    // Create admin user
    console.log('👤 Creating admin user...')
    const passwordHash = await bcrypt.hash(seedData.adminUser.password, 10)
    const adminResult = await client.query(`
      INSERT INTO admin_users (email, name, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [seedData.adminUser.email, seedData.adminUser.name, passwordHash, seedData.adminUser.role, seedData.adminUser.isActive])

    const adminId = adminResult.rows[0].id
    console.log(`✅ Admin user created: ${seedData.adminUser.email} / ${seedData.adminUser.password}`)

    // Create menu profile
    console.log('📋 Creating menu profile...')
    const menuProfileResult = await client.query(`
      INSERT INTO menu_profiles (name, name_en, description, description_en, is_active, is_default, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      seedData.menuProfile.name,
      seedData.menuProfile.nameEn,
      seedData.menuProfile.description,
      seedData.menuProfile.descriptionEn,
      seedData.menuProfile.isActive,
      seedData.menuProfile.isDefault,
      seedData.menuProfile.sortOrder
    ])

    const menuProfileId = menuProfileResult.rows[0].id

    // Create menu categories
    console.log('🗂️ Creating menu categories...')
    const categoryIds = {}
    for (const category of seedData.categories) {
      const result = await client.query(`
        INSERT INTO menu_categories (name, name_en, description, description_en, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [category.name, category.nameEn, category.description, category.descriptionEn, category.sortOrder, true])
      
      categoryIds[category.name] = result.rows[0].id
    }

    // Create menu items
    console.log('🍔 Creating menu items...')
    const menuItemIds = []
    for (const item of seedData.menuItems) {
      const result = await client.query(`
        INSERT INTO menu_items (
          name, name_en, description, description_en, price,
          category_id, ingredients, allergens,
          is_available, is_popular, sort_order
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `, [
        item.name,
        item.nameEn,
        item.description,
        item.descriptionEn,
        item.price,
        categoryIds[item.categoryName],
        JSON.stringify(item.ingredients),
        JSON.stringify(item.allergens),
        true,
        item.isPopular,
        item.sortOrder
      ])
      menuItemIds.push(result.rows[0].id)
    }

    // Link menu items to the menu profile using the junction table
    console.log('🔗 Linking menu items to menu profile...')
    for (let i = 0; i < menuItemIds.length; i++) {
      await client.query(`
        INSERT INTO menu_profile_items (menu_profile_id, menu_item_id, sort_order)
        VALUES ($1, $2, $3)
      `, [menuProfileId, menuItemIds[i], i + 1])
    }

    // Create site settings
    console.log('⚙️ Creating site settings...')
    for (const setting of seedData.siteSettings) {
      await client.query(`
        INSERT INTO site_settings (key, value, description, type, is_public)
        VALUES ($1, $2, $3, $4, $5)
      `, [setting.key, setting.value, setting.description, setting.type, setting.isPublic])
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 1 Admin user created')
    console.log('- 1 Menu profile created')
    console.log(`- ${seedData.categories.length} Menu categories created`)
    console.log(`- ${seedData.menuItems.length} Menu items created`)
    console.log(`- ${seedData.menuItems.length} Menu profile associations created`)
    console.log(`- ${seedData.siteSettings.length} Site settings created`)

    console.log('\n🔑 Admin Login:')
    console.log(`Email: ${seedData.adminUser.email}`)
    console.log(`Password: ${seedData.adminUser.password}`)
    console.log('\n⚠️  Remember to change the admin password in production!')

    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message)
    process.exit(1)
  }
}

seedDatabase()