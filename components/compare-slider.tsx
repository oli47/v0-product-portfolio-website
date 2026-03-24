'use client'

// Compare slider with drag and cycling After images - v5 rebuild
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface CompareSliderProps {
  beforeImage?: string
  afterImages?: string[]
}

export function CompareSlider({
  beforeImage = '/images/signup-old.jpg',
  afterImages = ['/images/signup-new1.jpg', '/images/signup-new2.jpg'],
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
      {/* Container with taller aspect ratio to show full images */}
      <div className="relative w-full" style={{ paddingBottom: '85%' }}>
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
              alt="After"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
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
            alt="Before"
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-contain pointer-events-none"
            priority
            draggable={false}
          />
        </div>

        {/* Slider vertical line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-foreground z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-border">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-foreground"
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

        {/* Fixed labels at bottom corners */}
        <div className="absolute bottom-4 left-4 text-[14px] font-medium text-foreground bg-white px-3 py-1.5 rounded shadow-sm pointer-events-none z-20">
          Before
        </div>
        <div className="absolute bottom-4 right-4 text-[14px] font-medium text-foreground bg-white px-3 py-1.5 rounded shadow-sm pointer-events-none z-20">
          After
        </div>
      </div>
    </div>
  )
}
