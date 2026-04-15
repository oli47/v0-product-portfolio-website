'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/components/lightbox'

interface SlideshowProps {
  images: string[]
  holdMs?: number
  transitionMs?: number
}

export function Slideshow({ images, holdMs = 1800, transitionMs = 450 }: SlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lockRef = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef(0)

  const count = images.length

  const slideTo = useCallback((to: number) => {
    if (lockRef.current || to === current) return
    lockRef.current = true
    setCurrent(to)
    setTimeout(() => { lockRef.current = false }, transitionMs)
  }, [current, transitionMs])

  const goNext = useCallback(() => {
    slideTo((current + 1) % count)
  }, [current, count, slideTo])

  const goPrev = useCallback(() => {
    slideTo((current - 1 + count) % count)
  }, [current, count, slideTo])

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(goNext, holdMs + transitionMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, holdMs, transitionMs, goNext])

  // Swipe on mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext()
      else goPrev()
    }
  }

  return (
    <>
      <div
        className="relative rounded-[0.125rem] overflow-hidden cursor-zoom-in group/slideshow"
        style={{ aspectRatio: '16 / 9' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide track */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${(current * 100) / count}%)`,
            transition: `transform ${transitionMs}ms ease-in-out`,
          }}
        >
          {images.map((src) => (
            <div key={src} className="relative shrink-0" style={{ width: `${100 / count}%`, height: '100%' }}>
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 680px"
              />
            </div>
          ))}
        </div>

        {/* Click to open lightbox */}
        <button
          type="button"
          aria-label="Enlarge image"
          className="absolute inset-0 z-10"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Nav arrows — desktop only, on hover */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-[2px] bg-[var(--color-000)]/80 text-[var(--color-400)] opacity-0 group-hover/slideshow:opacity-100 transition-all duration-300 hover:bg-[var(--color-000)] hover:text-[var(--color-500)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
            <path d="M10 3L5 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-[2px] bg-[var(--color-000)]/80 text-[var(--color-400)] opacity-0 group-hover/slideshow:opacity-100 transition-all duration-300 hover:bg-[var(--color-000)] hover:text-[var(--color-500)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
            <path d="M6 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>

        {/* Square indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation()
                slideTo(i)
              }}
              className="w-[6px] h-[6px] rounded-[1px] transition-colors duration-300"
              style={{
                backgroundColor: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          src={images[current]}
          images={images}
          startIndex={current}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
