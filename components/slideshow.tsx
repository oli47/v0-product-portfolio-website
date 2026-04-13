'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface SlideshowProps {
  images: string[]
  holdMs?: number
  transitionMs?: number
  width?: number
  height?: number
}

export function Slideshow({ images, holdMs = 1800, transitionMs = 600, width = 16, height = 9 }: SlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

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
    <div className="relative w-full rounded-[0.125rem] overflow-hidden" style={{ aspectRatio: `${width} / ${height}` }}>
      <Image
        src={images[current]}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 680px"
      />
      {next !== null && (
        <Image
          src={images[next]}
          alt=""
          fill
          className="object-cover absolute inset-0"
          style={{
            opacity: fading ? 1 : 0,
            transition: `opacity ${transitionMs}ms ease-in-out`,
          }}
          sizes="(max-width: 768px) 100vw, 680px"
        />
      )}
    </div>
  )
}
