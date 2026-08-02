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
// Where it fades in: well before it pins, so it is already there by the time
// the reader is reading rather than arriving as they pass the heading.
const RAIL_REVEAL_TOP = 420
// The rail only exists at this width, and so does the room it needs at the foot
// of the page. A phone gets neither.
const RAIL_QUERY = '(min-width: 1200px)'

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
        className="group flex flex-row-reverse items-center gap-3 py-1"
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
  // The rail is a reading aid, and there is nothing to aid until the reader is
  // in the reading. It stays out of the way over the title and the hero, and
  // fades in once the first section has come up to meet it.
  const [shown, setShown] = useState(false)
  // A click is an explicit choice and it has to hold. The sections at the foot
  // of the page can be shorter than the scroll the document has left — on the
  // contacts case study "Impact" wants 4176px and the page stops at 4160 — so
  // the scroll rule alone can never mark them current, and clicking one either
  // did nothing or lit up the section below it. The pin holds the reader's
  // choice until they scroll for themselves.
  const pinned = useRef<string | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.scrollY + ACTIVE_LINE

      // Follow the first section down the page, then stop at the pin line —
      // and only show it from the moment it gets there, so it arrives in its
      // resting place rather than sliding up the page from the fold.
      const first = document.getElementById(sectionId(items[0]))
      if (first) {
        const top = first.getBoundingClientRect().top
        setRailTop(Math.max(top, RAIL_PIN_TOP))
        setShown(top <= RAIL_REVEAL_TOP)
      }

      // A rail whose last entries cannot be scrolled to is a rail that lies:
      // the document simply runs out before the section reaches the line, so
      // clicking one used to land on the bottom of the page and light up
      // whatever was nearest. Rather than paper over that in the highlight,
      // give the page exactly the room the last section needs — no more, and
      // none at all on a width that has no rail.
      const last = document.getElementById(sectionId(items[items.length - 1]))
      if (last) {
        const root = document.documentElement
        // Read what is applied rather than remembering it: the measurement has
        // to subtract its own effect, and anything held in a ref goes stale the
        // first time the effect remounts with the padding already gone.
        const applied = parseFloat(getComputedStyle(root).getPropertyValue('--section-tail')) || 0
        const below = root.scrollHeight - applied - last.offsetTop
        const need = window.matchMedia(RAIL_QUERY).matches
          ? Math.max(0, window.innerHeight - SCROLL_OFFSET - below)
          : 0
        if (Math.abs(need - applied) > 1) root.style.setProperty('--section-tail', `${need}px`)
      }

      if (pinned.current) return

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
      document.documentElement.style.removeProperty('--section-tail')
    }
  }, [items])

  const animationRef = useRef<number>(0)

  // Any scroll of the reader's own hands the highlight back to the page.
  useEffect(() => {
    const release = () => { pinned.current = null }
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('keydown', release)
    return () => {
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('keydown', release)
    }
  }, [])

  const handleSelect = useCallback((badge: string) => {
    const el = document.getElementById(sectionId(badge))
    if (!el) return

    pinned.current = badge
    setActive(badge)

    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = Math.min(Math.max(el.offsetTop - SCROLL_OFFSET, 0), Math.max(max, 0))
    const start = window.scrollY
    const distance = target - start

    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    // Already as far down as the document goes: the highlight is the whole of
    // what the click can do, and it has already been set.
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
    // Both come off together. `once` only retires the one that fired, and the
    // clean-up at the end of `step` never runs on an aborted scroll, so the
    // other used to be left behind — one stale listener per interrupted click.
    const abort = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = 0
      pinned.current = null
      window.removeEventListener('wheel', abort)
      window.removeEventListener('touchstart', abort)
    }
    window.addEventListener('wheel', abort, { passive: true })
    window.addEventListener('touchstart', abort, { passive: true })

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
      className="hidden min-[1200px]:block fixed z-30 w-[11rem] text-right"
      // Not just invisible: nothing behind a transparent nav should take a
      // click, and a screen reader should not be offered a rail the page is
      // not showing yet.
      aria-hidden={!shown}
      style={{
        // The far side of the column: half the page, out past the 45rem of
        // content, then the same 2rem gutter the rail had on the left.
        left: 'calc(50% + 22.5rem + 2rem)',
        top: railTop ?? RAIL_PIN_TOP,
        opacity: shown ? 1 : 0,
        // `opacity: 0` alone left six links in the tab order inside an
        // aria-hidden subtree, which is the one thing aria-hidden must never
        // cover. `visibility` takes them out of both the tab order and the
        // accessibility tree; the zero-duration step is delayed so it lands
        // after the fade rather than cutting it.
        visibility: shown ? 'visible' : 'hidden',
        pointerEvents: shown ? undefined : 'none',
        transition: shown
          ? 'opacity 400ms ease-in-out, visibility 0s'
          : 'opacity 400ms ease-in-out, visibility 0s 400ms',
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
