import { NextRequest } from 'next/server'

/**
 * Get client IP address from request (edge compatible)
 */
export function getClientIP(request: NextRequest): string {
  // Check various headers for IP (in order of preference)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }

  // Fallback to connection remote address (might not be available in edge)
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('remote-addr') || 
         '127.0.0.1'
}

/**
 * Get User-Agent string from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'Unknown'
}

/**
 * Hash sensitive data for storage (IP addresses, etc.)
 * Using simple hash for edge compatibility
 */
export async function hashSensitiveData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = new Uint8Array(hashBuffer)
  const hashHex = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

/**
 * Validate session binding (IP + User-Agent)
 */
export function validateSessionBinding(
  sessionIP: string | null,
  sessionUA: string | null,
  currentIP: string,
  currentUA: string
): boolean {
  // Skip validation if no binding data stored
  if (!sessionIP || !sessionUA) {
    return true
  }

  // Check IP match (allow some flexibility for mobile networks)
  const ipMatches = sessionIP === currentIP
  
  // Check User-Agent match (should be exact)
  const uaMatches = sessionUA === currentUA

  return ipMatches && uaMatches
}