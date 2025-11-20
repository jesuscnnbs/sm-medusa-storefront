#!/usr/bin/env node

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const { readFileSync } = require('fs')
const { join } = require('path')

// Load environment variables from .env.local manually
try {
  const envLocal = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
  envLocal.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      process.env[key.trim()] = value.trim()
    }
  })
} catch (error) {
  // .env.local doesn't exist, that's fine
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
    const passwordHash = await bcrypt.hash('admin123', 10)
    const adminResult = await client.query(`
      INSERT INTO admin_users (email, name, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, ['admin@santamonica.com', 'Admin User', passwordHash, 'super_admin', true])
    
    const adminId = adminResult.rows[0].id
    console.log(`✅ Admin user created: admin@santamonica.com / admin123`)

    // Create menu profile
    console.log('📋 Creating menu profile...')
    const menuProfileResult = await client.query(`
      INSERT INTO menu_profiles (name, name_en, description, description_en, is_active, is_default, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      'Menú Principal', 
      'Main Menu', 
      'Nuestro delicioso menú de hamburguesas artesanales', 
      'Our delicious artisanal burger menu',
      true, 
      true, 
      0
    ])
    
    const menuProfileId = menuProfileResult.rows[0].id

    // Create menu categories
    console.log('🗂️ Creating menu categories...')
    const categories = [
      {
        name: 'Hamburguesas Clásicas',
        nameEn: 'Classic Burgers',
        description: 'Nuestras hamburguesas más populares',
        descriptionEn: 'Our most popular burgers',
        sortOrder: 1
      },
      {
        name: 'Hamburguesas Gourmet',
        nameEn: 'Gourmet Burgers',
        description: 'Hamburguesas premium con ingredientes especiales',
        descriptionEn: 'Premium burgers with special ingredients',
        sortOrder: 2
      },
      {
        name: 'Acompañamientos',
        nameEn: 'Sides',
        description: 'Papas, aros de cebolla y más',
        descriptionEn: 'Fries, onion rings and more',
        sortOrder: 3
      },
      {
        name: 'Bebidas',
        nameEn: 'Drinks',
        description: 'Refrescos, jugos y bebidas especiales',
        descriptionEn: 'Sodas, juices and specialty drinks',
        sortOrder: 4
      }
    ]

    const categoryIds = {}
    for (const category of categories) {
      const result = await client.query(`
        INSERT INTO menu_categories (name, name_en, description, description_en, sort_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [category.name, category.nameEn, category.description, category.descriptionEn, category.sortOrder, true])
      
      categoryIds[category.name] = result.rows[0].id
    }

    // Create menu items
    console.log('🍔 Creating menu items...')
    const menuItems = [
      // Classic Burgers
      {
        name: 'Santa Monica Classic',
        nameEn: 'Santa Monica Classic',
        description: 'Hamburguesa clásica con carne de res, lechuga, tomate, cebolla y salsa especial',
        descriptionEn: 'Classic burger with beef patty, lettuce, tomato, onion and special sauce',
        price: 1299, // $12.99
        categoryName: 'Hamburguesas Clásicas',
        ingredients: ['Carne de res 150g', 'Lechuga', 'Tomate', 'Cebolla', 'Salsa Santa Monica'],
        allergens: ['Gluten', 'Huevo'],
        isPopular: true,
        sortOrder: 1
      },
      {
        name: 'Cheeseburger Deluxe',
        nameEn: 'Cheeseburger Deluxe',
        description: 'Hamburguesa con doble queso cheddar, tocino crujiente y vegetales frescos',
        descriptionEn: 'Burger with double cheddar cheese, crispy bacon and fresh vegetables',
        price: 1499,
        categoryName: 'Hamburguesas Clásicas',
        ingredients: ['Carne de res 150g', 'Doble queso cheddar', 'Tocino', 'Lechuga', 'Tomate'],
        allergens: ['Gluten', 'Lácteos'],
        isPopular: true,
        sortOrder: 2
      },
      // Gourmet Burgers
      {
        name: 'BBQ Bacon Supreme',
        nameEn: 'BBQ Bacon Supreme',
        description: 'Hamburguesa gourmet con salsa BBQ casera, tocino ahumado y cebolla caramelizada',
        descriptionEn: 'Gourmet burger with homemade BBQ sauce, smoked bacon and caramelized onions',
        price: 1799,
        categoryName: 'Hamburguesas Gourmet',
        ingredients: ['Carne de res 200g', 'Salsa BBQ casera', 'Tocino ahumado', 'Cebolla caramelizada', 'Queso gouda'],
        allergens: ['Gluten', 'Lácteos'],
        isPopular: false,
        sortOrder: 1
      },
      {
        name: 'Mushroom Swiss',
        nameEn: 'Mushroom Swiss',
        description: 'Hamburguesa con champiñones salteados y queso suizo derretido',
        descriptionEn: 'Burger with sautéed mushrooms and melted Swiss cheese',
        price: 1699,
        categoryName: 'Hamburguesas Gourmet',
        ingredients: ['Carne de res 180g', 'Champiñones salteados', 'Queso suizo', 'Cebolla morada', 'Mayonesa de ajo'],
        allergens: ['Gluten', 'Lácteos', 'Huevo'],
        isPopular: false,
        sortOrder: 2
      },
      // Sides
      {
        name: 'Papas Fritas Clásicas',
        nameEn: 'Classic French Fries',
        description: 'Papas fritas doradas y crujientes',
        descriptionEn: 'Golden and crispy french fries',
        price: 599,
        categoryName: 'Acompañamientos',
        ingredients: ['Papas', 'Sal marina'],
        allergens: [],
        isPopular: true,
        sortOrder: 1
      },
      {
        name: 'Aros de Cebolla',
        nameEn: 'Onion Rings',
        description: 'Aros de cebolla empanizados y fritos',
        descriptionEn: 'Breaded and fried onion rings',
        price: 699,
        categoryName: 'Acompañamientos',
        ingredients: ['Cebolla', 'Harina', 'Huevo', 'Pan molido'],
        allergens: ['Gluten', 'Huevo'],
        isPopular: false,
        sortOrder: 2
      },
      // Drinks
      {
        name: 'Coca-Cola',
        nameEn: 'Coca-Cola',
        description: 'Refresco de cola clásico',
        descriptionEn: 'Classic cola soft drink',
        price: 299,
        categoryName: 'Bebidas',
        ingredients: ['Agua carbonatada', 'Jarabe de cola'],
        allergens: [],
        isPopular: true,
        sortOrder: 1
      },
      {
        name: 'Limonada Natural',
        nameEn: 'Fresh Lemonade',
        description: 'Limonada fresca hecha en casa',
        descriptionEn: 'Fresh homemade lemonade',
        price: 399,
        categoryName: 'Bebidas',
        ingredients: ['Limón fresco', 'Agua', 'Azúcar', 'Hielo'],
        allergens: [],
        isPopular: false,
        sortOrder: 2
      }
    ]

    const menuItemIds = []
    for (const item of menuItems) {
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
    const siteSettings = [
      {
        key: 'restaurant_name',
        value: 'Santa Monica Burgers',
        description: 'Restaurant name displayed on the site',
        type: 'string',
        isPublic: true
      },
      {
        key: 'restaurant_phone',
        value: '+1 (555) 123-4567',
        description: 'Restaurant contact phone number',
        type: 'string',
        isPublic: true
      },
      {
        key: 'restaurant_email',
        value: 'info@santamonica.com',
        description: 'Restaurant contact email',
        type: 'string',
        isPublic: true
      },
      {
        key: 'restaurant_address',
        value: '123 Ocean Ave, Santa Monica, CA 90401',
        description: 'Restaurant physical address',
        type: 'string',
        isPublic: true
      },
      {
        key: 'opening_hours',
        value: JSON.stringify({
          monday: '11:00-22:00',
          tuesday: '11:00-22:00',
          wednesday: '11:00-22:00',
          thursday: '11:00-22:00',
          friday: '11:00-23:00',
          saturday: '10:00-23:00',
          sunday: '10:00-21:00'
        }),
        description: 'Restaurant opening hours',
        type: 'json',
        isPublic: true
      }
    ]

    for (const setting of siteSettings) {
      await client.query(`
        INSERT INTO site_settings (key, value, description, type, is_public)
        VALUES ($1, $2, $3, $4, $5)
      `, [setting.key, setting.value, setting.description, setting.type, setting.isPublic])
    }

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 1 Admin user created')
    console.log('- 1 Menu profile created')
    console.log('- 4 Menu categories created')
    console.log('- 8 Menu items created')
    console.log('- 8 Menu profile associations created')
    console.log('- 5 Site settings created')
    
    console.log('\n🔑 Admin Login:')
    console.log('Email: admin@santamonica.com')
    console.log('Password: admin123')
    console.log('\n⚠️  Remember to change the admin password in production!')

    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message)
    process.exit(1)
  }
}

seedDatabase()