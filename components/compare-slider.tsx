'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function CompareSlider() {
  const [afterIndex, setAfterIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const afterImages = [
    { src: '/images/signup-new1.jpg', label: 'After — Step 1' },
    { src: '/images/signup-new2.jpg', label: 'After — Step 2' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setAfterIndex((prev) => (prev + 1) % afterImages.length)
        setIsTransitioning(false)
      }, 400)
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full rounded-[10px] border border-border overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '2/1' }}>
        {/* Container for both images */}
        <div className="flex w-full h-full">
          {/* Before image - left side */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <Image
              src="/images/signup-old.jpg"
              alt="Before"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* After image - right side with fade transition */}
          <div className="w-1/2 h-full relative overflow-hidden">
            {afterImages.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  opacity: idx === afterIndex ? 1 : 0,
                  transitionTimingFunction: 'linear',
                }}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ))}
          </div>

          {/* Center divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2" />
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 text-[14px] font-medium text-foreground bg-white/80 px-3 py-1 rounded">
          Before
        </div>
        <div className="absolute bottom-4 right-4 text-[14px] font-medium text-foreground bg-white/80 px-3 py-1 rounded">
          After
        </div>
      </div>
    </div>
  )
}
