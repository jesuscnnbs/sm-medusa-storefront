/**
 * Check if the app is running on localhost
 * Used to enable/disable file system operations (upload/delete images)
 */
export const isLocalhost = (): boolean => {
  if (typeof window === "undefined") {
    // Server-side: check NODE_ENV
    return process.env.NODE_ENV === "development"
  }

  // Client-side: check hostname
  const hostname = window.location.hostname
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local")
  )
}

/**
 * Check if file system operations are allowed
 * Only allowed in development/localhost
 */
export const canModifyFileSystem = (): boolean => {
  return isLocalhost()
}
