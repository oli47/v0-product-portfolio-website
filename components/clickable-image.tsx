'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from '@/components/lightbox'

export function ClickableImage({ src, alt, width, height, className, priority, objectPosition }: {
  src: string; alt: string; width: number; height: number; className?: string; priority?: boolean; objectPosition?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`Enlarge image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          unoptimized={src.endsWith('.gif')}
          width={width}
          height={height}
          quality={95}
          sizes="(max-width: 768px) 100vw, 680px"
          className={`${className} pointer-events-none transition-opacity duration-[400ms] ease-in-out hover:opacity-80`}
          style={objectPosition ? { objectPosition } : undefined}
          priority={priority}
        />
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}
