'use client'

// Compare slider with drag and cycling After images - v3
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface CompareSliderProps {
  beforeImage?: string
  afterImages?: string[]
  beforeLabel?: string
  afterLabels?: string[]
}

export function CompareSlider({
  beforeImage = '/images/signup-old.jpg',
  afterImages = ['/images/signup-new1.jpg', '/images/signup-new2.jpg'],
  beforeLabel = 'Before',
  afterLabels = ['After — Step 1', 'After — Step 2'],
}: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [currentAfterIndex, setCurrentAfterIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cycle through After images every 1800ms
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentAfterIndex((prev) => (prev + 1) % afterImages.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 200)
    }, 1800)

    return () => clearInterval(interval)
  }, [afterImages.length])

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleTouchStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleTouchEnd = () => setIsDragging(false)

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX)
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleTouchMove)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging, handleMove])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg overflow-hidden border border-border select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Container with proper aspect ratio based on image dimensions */}
      <div className="relative w-full" style={{ paddingBottom: '62.5%' }}>
        {/* After images (cycling with crossfade) */}
        {afterImages.map((src, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{
              opacity: idx === currentAfterIndex ? (isTransitioning ? 0 : 1) : 0,
            }}
          >
            <Image
              src={src}
              alt={afterLabels[idx] || 'After'}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              quality={85}
              className="object-contain pointer-events-none"
              priority
              draggable={false}
            />
          </div>
        ))}

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            quality={85}
            className="object-contain pointer-events-none"
            priority
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-gray-500"
            >
              <path
                d="M7 6L3 10L7 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 6L17 10L13 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels - positioned dynamically with slider */}
        <div 
          className="absolute bottom-4 text-[14px] font-medium text-foreground bg-white px-3 py-1.5 rounded shadow-sm pointer-events-none transition-opacity duration-200 z-20"
          style={{ 
            left: `${Math.max(sliderPosition / 2, 8)}%`,
            transform: 'translateX(-50%)',
            opacity: sliderPosition > 15 ? 1 : 0
          }}
        >
          {beforeLabel}
        </div>
        <div 
          className="absolute bottom-4 text-[14px] font-medium text-foreground bg-white px-3 py-1.5 rounded shadow-sm pointer-events-none transition-all duration-200 z-20"
          style={{ 
            right: `${Math.max((100 - sliderPosition) / 2, 8)}%`,
            transform: 'translateX(50%)',
            opacity: sliderPosition < 85 ? 1 : 0
          }}
        >
          {afterLabels[currentAfterIndex]}
        </div>
      </div>
    </div>
  )
}
