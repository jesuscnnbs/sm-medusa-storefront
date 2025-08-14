import { NextResponse } from 'next/server'
import { testDbConnection } from '@lib/db'

export async function GET() {
  try {
    console.log('Testing database connection...')
    const isConnected = await testDbConnection()
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: '✅ Database connection successful!' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: '❌ Database connection failed!' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      message: '❌ Database connection error!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}