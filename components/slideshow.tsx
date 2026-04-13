'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface SlideshowProps {
  images: string[]
  holdMs?: number
  transitionMs?: number
}

function SlideshowLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
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
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 pb-8 sm:p-8 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full max-h-full">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-9 right-0 min-h-[2.75rem] px-2 flex items-center text-eyebrow text-[var(--color-300)] hover:text-[var(--color-500)] transition-colors duration-[400ms] ease-in-out focus:outline-none focus-visible:text-[var(--color-500)]"
        >
          Close ✕
        </button>
        <Image
          src={src}
          alt=""
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="w-full h-auto rounded-sm"
        />
      </div>
    </div>
  )
}

export function Slideshow({ images, holdMs = 1800, transitionMs = 600 }: SlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [fading, setFading] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  useEffect(() => {
    const hold = setTimeout(() => {
      const n = (current + 1) % images.length
      setNext(n)
      setFading(true)
      const trans = setTimeout(() => {
        setCurrent(n)
        setNext(null)
        setFading(false)
      }, transitionMs)
      return () => clearTimeout(trans)
    }, holdMs)
    return () => clearTimeout(hold)
  }, [current, holdMs, transitionMs, images.length])

  return (
    <>
      <div
        className="relative w-full rounded-[0.125rem] overflow-hidden cursor-zoom-in"
        style={{ aspectRatio: '16 / 9' }}
        onClick={() => setLightboxSrc(images[current])}
      >
        <Image
          src={images[current]}
          alt=""
          fill
          className="object-cover transition-opacity duration-[400ms] ease-in-out hover:opacity-80"
          sizes="(max-width: 768px) 100vw, 680px"
        />
        {next !== null && (
          <Image
            src={images[next]}
            alt=""
            fill
            className="object-cover absolute inset-0 pointer-events-none"
            style={{
              opacity: fading ? 1 : 0,
              transition: `opacity ${transitionMs}ms ease-in-out`,
            }}
            sizes="(max-width: 768px) 100vw, 680px"
          />
        )}
      </div>
      {lightboxSrc && (
        <SlideshowLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}
