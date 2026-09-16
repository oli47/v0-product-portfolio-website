'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
  /**
   * Ties the reveal to scroll position instead of firing once. The case
   * study's a long scroll, so its sections settle in and out continuously
   * as the reader moves past them, rather than popping in once and staying
   * there — same recipe as the default, just driven by how far a section
   * has crossed the viewport instead of a boolean. `delay` is ignored here:
   * a per-frame progress value has nothing for a fixed delay to offset.
   */
  scrollLinked?: boolean
}

// One entrance recipe for the whole site — settle down 10px, scale up from
// 98%, fade in. (Inspired by enzo.fyi's page transition: opacity 0 -> 1,
// translateY(-10px) -> 0, scale(0.98) -> 1, 300ms ease-in-out.) 400ms here
// to match every other transition already on this site (see the `ease-in-out`
// hovers throughout), not 300 — one duration, not two.
const OFFSET_Y = 10
const SCALE_FROM = 0.98
const DURATION = 0.4

export function FadeUp({ children, delay = 0, className, scrollLinked = false }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  // One-shot mode: trigger once when the section reaches the same -40px
  // line as before, then leave it alone — CSS transition does the rest.
  useEffect(() => {
    if (scrollLinked) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '-40px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [scrollLinked])

  // Scroll-linked mode: recompute a 0-1 progress every frame against the
  // section's own position, so it can also reverse on the way back up.
  // A section starts settling in once its top reaches 90% down the
  // viewport, and is fully in place by 60% down — the same window
  // regardless of section height, since it is read off the top edge only.
  // The rAF loop only runs while the section is anywhere near the
  // viewport (a generous, one-time IntersectionObserver margin gates it),
  // so sections far up or down the page cost nothing.
  useEffect(() => {
    if (!scrollLinked) return
    const el = ref.current
    if (!el) return

    let raf = 0

    const tick = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.9
      const end = vh * 0.6
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      setProgress(p)
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf)
        if (entry.isIntersecting) tick()
      },
      { rootMargin: '400px 0px 400px 0px' }
    )
    observer.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [scrollLinked])

  const p = scrollLinked ? progress : (visible ? 1 : 0)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * OFFSET_Y}px) scale(${SCALE_FROM + (1 - SCALE_FROM) * p})`,
        transition: scrollLinked
          ? 'none'
          : `opacity ${DURATION}s ease-in-out ${delay}s, transform ${DURATION}s ease-in-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
