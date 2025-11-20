#!/usr/bin/env node

// Push database schema to test database (for Playwright E2E tests)
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

// Load .env.test manually
const envTestPath = path.join(process.cwd(), '.env.test')
if (!fs.existsSync(envTestPath)) {
  console.error('❌ .env.test file not found!')
  console.error('Please create .env.test with your test database URL')
  console.error('Example: DATABASE_URL="postgresql://..."')
  process.exit(1)
}

const envContent = fs.readFileSync(envTestPath, 'utf8')
const lines = envContent.split('\n')

for (const line of lines) {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  }
}

async function pushTestDb() {
  try {
    console.log('🚀 Pushing database schema to test database...')
    const maskedUrl = process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@')
    console.log('📍 Target database:', maskedUrl)

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env.test')
    }

    const isNeon = process.env.DATABASE_URL.includes('neon.tech')
    console.log('🗄️  Database type:', isNeon ? 'NEON' : 'LOCAL')

    // Run drizzle-kit push with test database URL
    const drizzlePush = spawn('npx', ['drizzle-kit', 'push'], {
      stdio: 'inherit',
      env: {
        ...process.env,
      }
    })

    drizzlePush.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Schema successfully pushed to test database!')
        console.log('🎯 Next step: Run `npm run db:seed-test` to populate with test data')
      } else {
        console.error('❌ Failed to push schema to test database')
        process.exit(1)
      }
    })

  } catch (error) {
    console.error('💥 Error pushing to test database:', error.message)
    process.exit(1)
  }
}

// Run the push
pushTestDb()
