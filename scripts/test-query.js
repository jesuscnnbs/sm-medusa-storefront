#!/usr/bin/env node

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

async function testQuery() {
  console.log('🔄 Testing menu items query...')

  try {
    // Import after setting environment variables
    const { sql } = require('@vercel/postgres')
    
    // Simple query to test
    const result = await sql`
      SELECT 
        mi.id,
        mi.name,
        mi.price,
        mc.name as category_name
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      LIMIT 5
    `
    
    console.log('✅ Query successful!')
    console.log('📊 Found', result.rowCount, 'items')
    console.log('🍔 Sample data:')
    result.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.name} - $${(row.price / 100).toFixed(2)} (${row.category_name})`)
    })
    
  } catch (error) {
    console.error('❌ Query failed:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

testQuery()