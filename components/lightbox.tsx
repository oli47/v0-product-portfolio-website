'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

export function Lightbox({ src, alt = '', onClose }: { src: string; alt?: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (zoomed) {
      setZoomed(false)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin({ x, y })
    setZoomed(true)
  }, [zoomed])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) { setZoomed(false); return }
        onClose()
        return
      }
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [onClose, zoomed])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image'}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 pb-8 sm:p-8 ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-out'}`}
      onClick={zoomed ? () => setZoomed(false) : onClose}
    >
      <div className="relative max-w-5xl sm:max-w-7xl w-full max-h-full">
        <button
          ref={closeRef}
          onClick={(e) => { e.stopPropagation(); onClose() }}
          aria-label="Close lightbox"
          className="absolute -top-9 right-0 min-h-[2.75rem] px-2 flex items-center text-eyebrow text-[var(--color-300)] hover:text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out focus:outline-none focus-visible:text-[var(--color-500)]"
        >
          Close ✕
        </button>
        <div
          ref={imgRef}
          onClick={handleImageClick}
          className={`overflow-hidden rounded-sm ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        >
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            unoptimized={src.endsWith('.gif') || src.endsWith('.png')}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="w-full h-auto transition-transform duration-300 ease-out"
            style={{
              transform: zoomed ? 'scale(2.5)' : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
