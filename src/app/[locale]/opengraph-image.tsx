import { ImageResponse } from 'next/og'
import { OGImageTemplate } from './og-image-template'

export const runtime = 'edge'
export const alt = 'Santa Monica Burgers - Auténticos sabores de California'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Load LemonMilk font
  const fontData = await fetch(
    new URL('../../fonts/LemonMilkMedium.otf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  // Get base URL for absolute paths
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'

  return new ImageResponse(
    <OGImageTemplate baseUrl={baseUrl} />,
    {
      ...size,
      fonts: [
        {
          name: 'LemonMilk',
          data: fontData,
          style: 'normal',
          weight: 900,
        },
      ],
    }
  )
}
