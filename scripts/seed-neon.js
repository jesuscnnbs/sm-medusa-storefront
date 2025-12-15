#!/usr/bin/env node

const { loadEnvConfig } = require('@next/env')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const seedData = require('./seed-data')

// Load environment variables
loadEnvConfig(process.cwd())

// Also load .env.production directly
const envProdPath = path.join(process.cwd(), '.env.production')
if (fs.existsSync(envProdPath)) {
  const envContent = fs.readFileSync(envProdPath, 'utf8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=')
        process.env[key] = value
      }
    }
  }
}

async function seedNeonDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables')
    process.exit(1)
  }

  if (!databaseUrl.includes('neon.tech')) {
    console.log('⚠️  Warning: DATABASE_URL does not appear to be a Neon URL')
  }

  console.log('🌱 Starting Neon database seeding...')
  console.log('📍 Database URL:', databaseUrl.replace(/:[^:@]*@/, ':***@'))

  // Use Neon serverless driver
  const { neon } = require('@neondatabase/serverless')
  const sql = neon(databaseUrl)

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await sql`TRUNCATE TABLE menu_items, menu_categories, menu_profiles, admin_sessions, admin_users, site_settings RESTART IDENTITY CASCADE`

    // Create admin user
    console.log('👤 Creating admin user...')
    const passwordHash = await bcrypt.hash(seedData.adminUser.password, 10)
    const adminResult = await sql`
      INSERT INTO admin_users (email, name, password_hash, role, is_active)
      VALUES (${seedData.adminUser.email}, ${seedData.adminUser.name}, ${passwordHash}, ${seedData.adminUser.role}, ${seedData.adminUser.isActive})
      RETURNING id
    `

    const adminId = adminResult[0].id
    console.log(`✅ Admin user created: ${seedData.adminUser.email} / ${seedData.adminUser.password}`)

    // Create menu profile
    console.log('📋 Creating menu profile...')
    const menuProfileResult = await sql`
      INSERT INTO menu_profiles (name, name_en, description, description_en, is_active, is_default, sort_order)
      VALUES (
        ${seedData.menuProfile.name},
        ${seedData.menuProfile.nameEn},
        ${seedData.menuProfile.description},
        ${seedData.menuProfile.descriptionEn},
        ${seedData.menuProfile.isActive},
        ${seedData.menuProfile.isDefault},
        ${seedData.menuProfile.sortOrder}
      )
      RETURNING id
    `

    const menuProfileId = menuProfileResult[0].id

    // Create menu categories
    console.log('🗂️ Creating menu categories...')
    const categoryIds = {}
    for (const category of seedData.categories) {
      const result = await sql`
        INSERT INTO menu_categories (name, name_en, description, description_en, sort_order, is_active)
        VALUES (${category.name}, ${category.nameEn}, ${category.description}, ${category.descriptionEn}, ${category.sortOrder}, ${true})
        RETURNING id
      `
      
      categoryIds[category.name] = result[0].id
    }

    // Create menu items
    console.log('🍔 Creating menu items...')
    for (const item of seedData.menuItems) {
      await sql`
        INSERT INTO menu_items (
          name, name_en, description, description_en, price, 
          menu_profile_id, category_id, ingredients, allergens, 
          is_available, is_popular, sort_order, image
        )
        VALUES (
          ${item.name},
          ${item.nameEn},
          ${item.description},
          ${item.descriptionEn},
          ${item.price},
          ${menuProfileId},
          ${categoryIds[item.categoryName]},
          ${JSON.stringify(item.ingredients)},
          ${JSON.stringify(item.allergens)},
          ${true},
          ${item.isPopular},
          ${item.sortOrder},
          ${item.image || null}
        )
      `
    }

    // Create site settings
    console.log('⚙️ Creating site settings...')
    for (const setting of seedData.siteSettings) {
      await sql`
        INSERT INTO site_settings (key, value, description, type, is_public)
        VALUES (${setting.key}, ${setting.value}, ${setting.description}, ${setting.type}, ${setting.isPublic})
      `
    }

    console.log('✅ Neon database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 1 Admin user created')
    console.log('- 1 Menu profile created')
    console.log(`- ${seedData.categories.length} Menu categories created`)
    console.log(`- ${seedData.menuItems.length} Menu items created`)
    console.log(`- ${seedData.siteSettings.length} Site settings created`)

    console.log('\n🔑 Admin Login:')
    console.log(`Email: ${seedData.adminUser.email}`)
    console.log(`Password: ${seedData.adminUser.password}`)
    console.log('\n⚠️  Remember to change the admin password in production!')
    
  } catch (error) {
    console.error('❌ Neon database seeding failed:', error.message)
    console.error('🔍 Full error:', error)
    process.exit(1)
  }
}

seedNeonDatabase()