'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/components/lightbox'

interface SlideshowProps {
  images: string[]
  holdMs?: number
  transitionMs?: number
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
      <button
        type="button"
        aria-label="Enlarge image"
        className="relative block w-full rounded-[0.125rem] overflow-hidden cursor-zoom-in"
        style={{ aspectRatio: '16 / 9' }}
        onClick={() => setLightboxSrc(images[current])}
      >
        <Image
          src={images[current]}
          alt=""
          fill
          className="object-cover pointer-events-none transition-opacity duration-[400ms] ease-in-out hover:opacity-80"
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
      </button>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}
