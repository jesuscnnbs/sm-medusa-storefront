// Push database schema to Neon production database
const { loadEnvConfig } = require('@next/env')
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

async function pushToNeon() {
  try {
    console.log('🚀 Pushing database schema to Neon...')
    console.log('📍 Target database:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'))
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required')
    }
    
    if (!process.env.DATABASE_URL.includes('neon.tech')) {
      console.log('⚠️  Warning: DATABASE_URL does not appear to be a Neon URL')
      console.log('🔍 Make sure you have the Neon connection string in .env.production')
    }
    
    // Set production environment for drizzle-kit
    process.env.NODE_ENV = 'production'
    
    // Import and run drizzle-kit push
    const { spawn } = require('child_process')
    
    const drizzlePush = spawn('npx', ['drizzle-kit', 'push'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    })
    
    drizzlePush.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Schema successfully pushed to Neon!')
        console.log('🎯 Your Neon database now has all the tables from your local setup')
      } else {
        console.error('❌ Failed to push schema to Neon')
        process.exit(1)
      }
    })
    
  } catch (error) {
    console.error('💥 Error pushing to Neon:', error.message)
    console.error('🔍 Full error:', error)
    process.exit(1)
  }
}

// Run the push
pushToNeon()