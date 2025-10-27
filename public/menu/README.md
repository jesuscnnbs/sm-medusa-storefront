# Menu Images Directory

This directory stores all uploaded menu images for the Santa Monica Burgers website.

## How It Works

1. **Upload**: Admin users can upload images through the dish form at `/admin/dish`
2. **Storage**: Images are saved here in `/public/menu/`
3. **Git Tracking**: All images are committed to the repository
4. **Deployment**: When you push to GitHub, Vercel automatically deploys with the new images
5. **CDN**: Images are served via Vercel's CDN at `/menu/filename.jpg`

## Naming Convention

Images are automatically named with a timestamp prefix:
- Format: `{timestamp}-{sanitized-filename}.{ext}`
- Example: `1234567890-burger-acapulco.jpg`

## Supported Formats

- JPG/JPEG
- PNG
- GIF
- WebP

## File Size Limit

Maximum: 5MB per image

## Important Notes

- Images are version-controlled in Git
- Deployment takes 1-2 minutes after pushing changes
- Images are automatically optimized by Next.js when served
- Old images remain in the directory until manually removed
