'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

const ZOOM_SCALE = 2.5

interface LightboxProps {
  src: string
  alt?: string
  onClose: () => void
  /** Pass all images + startIndex to enable gallery navigation */
  images?: string[]
  startIndex?: number
}

export function Lightbox({ src, alt = '', onClose, images, startIndex = 0 }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const gallery = images && images.length > 1
  const activeSrc = gallery ? images[current] : src

  const goNext = useCallback(() => {
    if (!gallery || zoomed) return
    setCurrent((current + 1) % images.length)
  }, [gallery, images, current, zoomed])

  const goPrev = useCallback(() => {
    if (!gallery || zoomed) return
    setCurrent((current - 1 + images.length) % images.length)
  }, [gallery, images, current, zoomed])

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (didDrag.current) {
      didDrag.current = false
      return
    }
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

  // Drag to pan when zoomed
  useEffect(() => {
    if (!zoomed) return
    const container = containerRef.current
    if (!container) return

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      didDrag.current = false
      lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }

      const rect = container.getBoundingClientRect()
      const pxPerPctX = rect.width / 100
      const pxPerPctY = rect.height / 100

      setOrigin(prev => ({
        x: Math.max(0, Math.min(100, prev.x - dx / pxPerPctX)),
        y: Math.max(0, Math.min(100, prev.y - dy / pxPerPctY)),
      }))
    }

    const onMouseUp = () => { dragging.current = false }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [zoomed])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) { setZoomed(false); return }
        onClose()
        return
      }
      if (e.key === 'ArrowRight') { goNext(); return }
      if (e.key === 'ArrowLeft') { goPrev(); return }
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
  }, [onClose, zoomed, goNext, goPrev])

  // Reset zoom when switching slides
  useEffect(() => {
    setZoomed(false)
  }, [current])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 pb-8 sm:p-8 cursor-zoom-out"
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
          ref={containerRef}
          onClick={handleImageClick}
          className={`overflow-hidden rounded-sm select-none ${zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        >
          <Image
            key={activeSrc}
            src={activeSrc}
            alt={alt}
            width={1920}
            height={1080}
            draggable={false}
            unoptimized={activeSrc.endsWith('.gif') || activeSrc.endsWith('.png')}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="w-full h-auto pointer-events-none"
            style={{
              transform: zoomed ? `scale(${ZOOM_SCALE})` : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transition: dragging.current ? 'none' : 'transform 300ms ease-out',
            }}
          />
        </div>

        {/* Gallery navigation */}
        {gallery && !zoomed && (
          <>
            {/* Nav arrows */}
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-[2px] bg-[var(--color-000)]/80 text-[var(--color-400)] transition-all duration-300 hover:bg-[var(--color-000)] hover:text-[var(--color-500)]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
                <path d="M10 3L5 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-[2px] bg-[var(--color-000)]/80 text-[var(--color-400)] transition-all duration-300 hover:bg-[var(--color-000)] hover:text-[var(--color-500)]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
                <path d="M6 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            </button>

            {/* Square indicators */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                  className="w-[6px] h-[6px] rounded-[1px] transition-colors duration-300"
                  style={{
                    backgroundColor: i === current ? 'var(--accent)' : 'var(--color-200)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
