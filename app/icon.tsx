import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#1A1714"/>
        <rect x="11" y="10" width="4" height="4" fill="#FAF7F2"/>
        <rect x="18" y="10" width="4" height="4" fill="#FAF7F2"/>
        <rect x="7"  y="14" width="4" height="4" fill="#FAF7F2"/>
        <rect x="14" y="14" width="4" height="4" fill="#FAF7F2"/>
        <rect x="21" y="14" width="4" height="4" fill="#FAF7F2"/>
        <rect x="11" y="18" width="4" height="4" fill="#FAF7F2"/>
        <rect x="18" y="18" width="4" height="4" fill="#FAF7F2"/>
      </svg>
    ),
    { ...size },
  )
}
