import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          backgroundColor: '#F2EDE3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 13,
          fontWeight: 400,
          color: '#B84A12',
          letterSpacing: 1,
        }}
      >
        OO
      </div>
    ),
    { ...size },
  )
}
