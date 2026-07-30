'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useScramble } from '@/lib/use-scramble'

/** Shared with the page so section ids and nav targets can never drift apart. */
export function sectionId(badge: string) {
  return badge.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

// Clears the fixed nav (py-[2.5rem] wrapper around an h-[2.5rem] bar).
const SCROLL_OFFSET = 120
// Where the "you are here" line sits: a little below the nav, so a section
// counts as current once its badge has comfortably entered the viewport.
const ACTIVE_LINE = 160
// The rail starts level with the first section (Context) and stops here once
// that section has scrolled up past it — sticky, without leaving the flow.
const RAIL_PIN_TOP = 160

function SectionNavItem({
  badge,
  active,
  onSelect,
}: {
  badge: string
  active: boolean
  onSelect: (badge: string) => void
}) {
  const label = useScramble(badge)

  return (
    <li>
      <a
        href={`#${sectionId(badge)}`}
        aria-current={active ? 'true' : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(badge)
        }}
        onMouseEnter={label.scramble}
        onMouseLeave={label.reset}
        className="group flex items-center gap-3 py-1"
      >
        <span
          aria-hidden="true"
          className="h-px shrink-0 transition-all duration-[400ms] ease-in-out group-hover:bg-[var(--accent)]"
          style={{
            width: active ? '2rem' : '1rem',
            backgroundColor: active ? 'var(--color-500)' : 'var(--color-100)',
          }}
        />
        <span
          ref={label.spanRef}
          className="text-eyebrow transition-colors duration-[400ms] ease-in-out group-hover:text-[var(--accent)]"
          style={{ color: active ? 'var(--color-500)' : 'var(--color-300)' }}
        >
          {badge}
        </span>
      </a>
    </li>
  )
}

export function SectionNav({ items }: { items: string[] }) {
  const [active, setActive] = useState(items[0] ?? '')
  const [railTop, setRailTop] = useState<number | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.scrollY + ACTIVE_LINE

      // Follow the first section down the page, then stop at the pin line.
      const first = document.getElementById(sectionId(items[0]))
      if (first) setRailTop(Math.max(first.getBoundingClientRect().top, RAIL_PIN_TOP))

      // Bottom of the page: the last section may be too short to ever cross
      // the line on its own, so claim it explicitly.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      if (atBottom) {
        setActive(items[items.length - 1])
        return
      }

      let current = items[0]
      for (const badge of items) {
        const el = document.getElementById(sectionId(badge))
        if (el && el.offsetTop <= line) current = badge
      }
      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  const animationRef = useRef<number>(0)

  const handleSelect = useCallback((badge: string) => {
    const el = document.getElementById(sectionId(badge))
    if (!el) return

    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = Math.min(Math.max(el.offsetTop - SCROLL_OFFSET, 0), Math.max(max, 0))
    const start = window.scrollY
    const distance = target - start

    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (Math.abs(distance) < 2) return

    // Native `behavior: 'smooth'` is unreliable here — it silently no-ops for
    // long distances in some environments — so drive the animation ourselves.
    // easeOutCubic, matching the theme transition in nav.tsx.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, target)
      return
    }

    const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.35))
    const startTime = performance.now()

    // A real scroll gesture mid-flight means the user took over — stop animating.
    const abort = () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); animationRef.current = 0 }
    window.addEventListener('wheel', abort, { passive: true, once: true })
    window.addEventListener('touchstart', abort, { passive: true, once: true })

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      window.scrollTo(0, start + distance * eased)
      if (t < 1) {
        animationRef.current = requestAnimationFrame(step)
      } else {
        animationRef.current = 0
        window.removeEventListener('wheel', abort)
        window.removeEventListener('touchstart', abort)
      }
    }

    animationRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }, [])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="Case study sections"
      className="hidden min-[1200px]:block fixed z-30 w-[11rem]"
      style={{
        left: 'calc(50% - 22.5rem - 2rem - 11rem)',
        top: railTop ?? RAIL_PIN_TOP,
        // Hold it back for the one frame before the first measurement lands,
        // otherwise it flashes at the pin position and jumps down to Context.
        opacity: railTop === null ? 0 : 1,
        transition: 'opacity 400ms ease-in-out',
      }}
    >
      <ul className="flex flex-col gap-4">
        {items.map((badge) => (
          <SectionNavItem
            key={badge}
            badge={badge}
            active={badge === active}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </nav>
  )
}
