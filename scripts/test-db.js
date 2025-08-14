#!/usr/bin/env node

// Simple database connection test script
const { Pool } = require('pg')
const { readFileSync } = require('fs')
const { join } = require('path')

// Load environment variables from .env.local manually
try {
  const envLocal = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
  envLocal.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '') // Remove quotes
      process.env[key.trim()] = value.trim()
    }
  })
} catch (error) {
  // .env.local doesn't exist, that's fine
}

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables')
    console.log('Please create .env.local file with your database credentials')
    process.exit(1)
  }

  console.log('🔄 Testing database connection...')
  console.log(`📍 Using: ${databaseUrl.replace(/:\/\/.*@/, '://***@')}`) // Hide credentials

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    connectionTimeoutMillis: 5000,
  })

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as version')
    
    console.log('✅ Database connection successful!')
    console.log(`🕐 Server time: ${result.rows[0].current_time}`)
    console.log(`📦 PostgreSQL version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`)
    
    client.release()
    await pool.end()
    
    console.log('\n🚀 Ready to run database migrations!')
    console.log('Run: npm run db:push')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tips:')
      console.log('- Make sure PostgreSQL is running locally')
      console.log('- Check your DATABASE_URL in .env.local')
      console.log('- Verify database exists and credentials are correct')
    }
    
    process.exit(1)
  }
}

testConnection()