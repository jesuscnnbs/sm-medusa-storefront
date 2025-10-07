#!/usr/bin/env node

const { loadEnvConfig } = require('@next/env')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

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
    const passwordHash = await bcrypt.hash('admin123', 10)
    const adminResult = await sql`
      INSERT INTO admin_users (email, name, password_hash, role, is_active)
      VALUES (${'admin@santamonica.com'}, ${'Admin User'}, ${passwordHash}, ${'super_admin'}, ${true})
      RETURNING id
    `
    
    const adminId = adminResult[0].id
    console.log(`✅ Admin user created: admin@santamonica.com / admin123`)

    // Create menu profile
    console.log('📋 Creating menu profile...')
    const menuProfileResult = await sql`
      INSERT INTO menu_profiles (name, name_en, description, description_en, is_active, is_default, sort_order)
      VALUES (
        ${'Menú Principal'}, 
        ${'Main Menu'}, 
        ${'Nuestro delicioso menú de hamburguesas artesanales'}, 
        ${'Our delicious artisanal burger menu'},
        ${true}, 
        ${true}, 
        ${0}
      )
      RETURNING id
    `
    
    const menuProfileId = menuProfileResult[0].id

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
      const result = await sql`
        INSERT INTO menu_categories (name, name_en, description, description_en, sort_order, is_active)
        VALUES (${category.name}, ${category.nameEn}, ${category.description}, ${category.descriptionEn}, ${category.sortOrder}, ${true})
        RETURNING id
      `
      
      categoryIds[category.name] = result[0].id
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
        sortOrder: 1,
        image: 'https://drive.google.com/file/d/1W2nI_cLHVWNDHzjFqoJBxWeimTfXzIfr/view'
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

    for (const item of menuItems) {
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
      await sql`
        INSERT INTO site_settings (key, value, description, type, is_public)
        VALUES (${setting.key}, ${setting.value}, ${setting.description}, ${setting.type}, ${setting.isPublic})
      `
    }

    console.log('✅ Neon database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- 1 Admin user created')
    console.log('- 1 Menu profile created')
    console.log('- 4 Menu categories created')
    console.log('- 8 Menu items created')
    console.log('- 5 Site settings created')
    
    console.log('\n🔑 Admin Login:')
    console.log('Email: admin@santamonica.com')
    console.log('Password: admin123')
    console.log('\n⚠️  Remember to change the admin password in production!')
    
  } catch (error) {
    console.error('❌ Neon database seeding failed:', error.message)
    console.error('🔍 Full error:', error)
    process.exit(1)
  }
}

seedNeonDatabase()