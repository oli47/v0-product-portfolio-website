'use client'

import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'

export function CompareSlider({
  beforeImage,
  afterImages,
}: {
  beforeImage: string
  afterImages: { src: string; label: string }[]
}) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPosition(p => Math.max(p - 5, 0))
    if (e.key === 'ArrowRight') setSliderPosition(p => Math.min(p + 5, 100))
  }, [])

  // Always listen for mouseup/touchend to stop dragging
  useEffect(() => {
    const stop = () => setIsDragging(false)
    document.addEventListener('mouseup', stop)
    document.addEventListener('touchend', stop, { passive: true })
    return () => {
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('touchend', stop)
    }
  }, [])

  // Only attach move listeners while dragging
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX) }
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging, handleMove])

  // Cycle through after images every 2s
  useEffect(() => {
    if (afterImages.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % afterImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [afterImages.length])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] select-none cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{ aspectRatio: '4/3' }}
      role="slider"
      aria-label="Before / After comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onKeyDown={handleKeyDown}
    >
      {/* After images — stacked, crossfading */}
      {afterImages.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0"
          style={{ opacity: i === activeIndex ? 1 : 0, transition: 'opacity 600ms ease-in-out' }}
        >
          <Image src={img.src} alt={img.label} fill sizes="(max-width: 768px) 100vw, 680px" className="object-cover" />
        </div>
      ))}

      {/* Before image — clipped to left side */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <Image src={beforeImage} alt="Before" fill sizes="(max-width: 768px) 100vw, 680px" className="object-cover" />
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[var(--color-500)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--background)] rounded-sm shadow-md flex items-center justify-center border border-[var(--color-100)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-400)]">
            <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 text-eyebrow text-[var(--color-300)] bg-[var(--color-step-bg)] px-2 py-1 rounded-[0.125rem] shadow-sm z-20 border border-[var(--color-150)]">Before</div>
      <div className="absolute top-4 right-4 text-eyebrow text-white bg-[var(--accent)] px-2 py-1 rounded-[0.125rem] shadow-sm z-20" style={{ transition: 'opacity 400ms ease-in-out' }}>{afterImages[activeIndex].label}</div>
    </div>
  )
}
