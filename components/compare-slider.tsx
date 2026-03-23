'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface CompareSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel: string
  afterLabel: string
  beforeAlt?: string
  afterAlt?: string
}

export function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  beforeAlt = 'Before',
  afterAlt = 'After',
}: CompareSliderProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsResizing(false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100
      setPosition(Math.min(Math.max(newPosition, 0), 100))
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[10px] border border-border cursor-col-resize select-none"
    >
      {/* After image (background) */}
      <div className="relative w-full h-auto">
        <Image
          src={afterSrc}
          alt={afterAlt}
          width={720}
          height={960}
          className="w-full h-auto block"
          priority
        />
      </div>

      {/* Before image (overlay) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          width={720}
          height={960}
          className="w-full h-auto block"
          priority
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-foreground cursor-col-resize"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
      >
        {/* Handle indicators */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-foreground"
          >
            <path
              d="M8 6L4 10L8 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-foreground"
          >
            <path
              d="M12 6L16 10L12 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-[12px] font-medium rounded pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-[12px] font-medium rounded pointer-events-none">
        {afterLabel}
      </div>
    </div>
  )
}
