#!/usr/bin/env node

// Test connection to TEST database (from .env.test)
const { Pool } = require('pg')
const { readFileSync } = require('fs')
const { join } = require('path')

// Load environment variables from .env.test
try {
  const envTest = readFileSync(join(process.cwd(), '.env.test'), 'utf8')
  envTest.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')
        process.env[key.trim()] = value.trim()
      }
    }
  })
} catch (error) {
  console.error('❌ .env.test file not found!')
  console.error('Please create .env.test with your test database URL')
  console.error('Example:')
  console.error('DATABASE_URL="postgresql://user:password@ep-test-xxxxx.neon.tech/test_db?sslmode=require"')
  console.error('NODE_ENV="test"')
  process.exit(1)
}

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env.test')
    process.exit(1)
  }

  if (databaseUrl === 'REPLACE_WITH_YOUR_NEON_TEST_DB_CONNECTION_STRING' ||
      databaseUrl === 'PASTE_YOUR_CONNECTION_STRING_HERE') {
    console.error('❌ Please replace the placeholder DATABASE_URL in .env.test with your actual Neon connection string')
    process.exit(1)
  }

  console.log('🔄 Testing TEST database connection...')
  const maskedUrl = databaseUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@')
  console.log(`📍 Using: ${maskedUrl}`)
  console.log(`🗄️  Database type: ${databaseUrl.includes('neon.tech') ? 'NEON' : 'LOCAL'}`)

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    connectionTimeoutMillis: 10000,
  })

  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as version')

    console.log('\n✅ TEST database connection successful!')
    console.log(`🕐 Server time: ${result.rows[0].current_time}`)
    console.log(`📦 PostgreSQL version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`)

    // Check if schema exists
    const schemaCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      LIMIT 5
    `)

    if (schemaCheck.rows.length > 0) {
      console.log(`\n📊 Found ${schemaCheck.rows.length} tables in database`)
      console.log('Tables:', schemaCheck.rows.map(r => r.table_name).join(', '))
    } else {
      console.log('\n⚠️  No tables found - you need to push the schema')
      console.log('Run: npm run db:push-test')
    }

    client.release()
    await pool.end()

    console.log('\n🎯 Next steps:')
    console.log('1. Push schema: npm run db:push-test')
    console.log('2. Seed data: npm run db:seed-test')
    console.log('3. Run tests: npm run test:headless')

  } catch (error) {
    console.error('\n❌ TEST database connection failed:')
    console.error(error.message)

    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Tips:')
      console.log('- Check your DATABASE_URL in .env.test')
      console.log('- Verify the Neon connection string is correct')
      console.log('- Make sure you copied the full connection string including ?sslmode=require')
    }

    process.exit(1)
  }
}

testConnection()
