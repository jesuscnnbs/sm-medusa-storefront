export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url

  // Check if it's a Google Drive URL
  const driveUrlPattern = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveUrlPattern)
  
  if (match && match[1]) {
    const fileId = match[1]
    // Convert to direct image URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  // Return original URL if it's not a Google Drive sharing URL
  return url
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}