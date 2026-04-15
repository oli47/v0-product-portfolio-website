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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const lockRef = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Slides laid out side by side in a track; we translateX the track
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

  return (
    <>
      <div
        className="relative rounded-[0.125rem] overflow-hidden cursor-zoom-in group/slideshow"
        style={{ aspectRatio: '16 / 9' }}
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
          {images.map((src, i) => (
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
          onClick={() => setLightboxSrc(images[current])}
        />

        {/* Nav arrows — visible on hover */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-[2px] bg-black/40 text-white opacity-0 group-hover/slideshow:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
            <path d="M10 3L5 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-[2px] bg-black/40 text-white opacity-0 group-hover/slideshow:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ stroke: 'currentColor' }}>
            <path d="M6 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </button>

        {/* Square indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-black/30">
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

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}
