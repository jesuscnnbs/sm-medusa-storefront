import { useState, useEffect } from 'react'

/**
 * Custom hook to handle async params in Next.js App Router
 * @param params - Promise-wrapped params from Next.js
 * @returns Resolved params object or null if still loading
 */
export function useParams<T = any>(params: Promise<T>): T | null {
  const [resolvedParams, setResolvedParams] = useState<T | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  return resolvedParams
}