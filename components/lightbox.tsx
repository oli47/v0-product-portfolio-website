'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export function Lightbox({ src, alt = '', onClose }: { src: string; alt?: string; onClose: () => void }) {
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
      aria-label={alt || 'Image'}
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
          alt={alt}
          width={1920}
          height={1080}
          unoptimized={src.endsWith('.gif')}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="w-full h-auto rounded-sm"
        />
      </div>
    </div>
  )
}
