// Test Neon database connection script
const { loadEnvConfig } = require('@next/env')
const fs = require('fs')
const path = require('path')

// Load environment variables
loadEnvConfig(process.cwd())

// Also try to load .env.production directly
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

async function testNeonConnection() {
  try {
    console.log('🔄 Testing Neon database connection...')
    
    // Force production environment to test Neon driver
    process.env.NODE_ENV = 'production'
    process.env.VERCEL = 'true' // Force Neon driver usage
    
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'))
    
    // Test Neon connection directly
    const { neon } = require('@neondatabase/serverless')
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required')
    }
    
    // Check if it's actually a Neon URL
    if (!process.env.DATABASE_URL.includes('neon.tech')) {
      console.log('⚠️  Warning: DATABASE_URL does not appear to be a Neon URL')
      console.log('🔍 Make sure you have the Neon connection string in .env.production')
    }
    
    const sql = neon(process.env.DATABASE_URL)
    
    // Test the connection using tagged template syntax
    const result = await sql`SELECT 1 as test`
    
    if (result && result[0] && result[0].test === 1) {
      console.log('✅ Neon database connection successful!')
      console.log('🎯 Test query returned:', result[0])
    } else {
      console.log('❌ Neon database connection failed - unexpected result')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('💥 Error testing Neon connection:', error.message)
    if (error.message.includes('tagged-template')) {
      console.error('ℹ️  This error suggests the Neon driver is working but the query syntax was wrong (now fixed)')
    }
    console.error('🔍 Full error:', error)
    process.exit(1)
  }
}

// Run the test
testNeonConnection()