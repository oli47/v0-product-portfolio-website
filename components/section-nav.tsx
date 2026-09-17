'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
// The stretch of scroll at the very bottom that belongs to the last section.
// Everything above it has to be able to reach the line under its own steam.
const BOTTOM_BAND = 80

// Not `el.offsetTop`: that's relative to `offsetParent`, and any ancestor
// with a `transform` (even `translateY(0)`) becomes one — which `<FadeUp>`
// always sets, so every section measured through it read as offset 0 from
// its own wrapper instead of the page, and the "you are here" line locked
// onto whichever section happened to iterate last. `getBoundingClientRect`
// reports true viewport position regardless of what an ancestor's transform
// is doing, immune to that trap.
const pageTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

/** A section's own place in the rail relative to where the reader is:
 *  `done` and `active` both read as filled — a progress bar's own trail
 *  behind (and including) the current position is one colour, not two —
 *  `upcoming` hasn't been reached yet. `active` still carries `aria-current`
 *  even though it looks identical to `done`; that distinction is for
 *  assistive tech, not the eye. */
type SectionState = 'done' | 'active' | 'upcoming'

function SectionNavItem({
  label,
  target,
  state,
  onSelect,
}: {
  label: string
  target: string
  state: SectionState
  onSelect: (label: string) => void
}) {
  return (
    <li>
      {/* No label text — just the tick, so the rail reads as a slim index
          rather than a second column of words beside the page's own. The
          name is still there for anyone who needs it: `aria-label` for a
          screen reader, `title` for a mouse hovering long enough to ask. */}
      <a
        href={`#${target}`}
        aria-label={label}
        title={label}
        aria-current={state === 'active' ? 'true' : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(label)
        }}
        className="group flex items-center justify-center py-1"
      >
        <span
          aria-hidden="true"
          className="w-px h-4 shrink-0 transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--accent)]"
          style={{
            backgroundColor: state === 'upcoming' ? 'var(--color-100)' : 'var(--accent)',
          }}
        />
      </a>
    </li>
  )
}

export type SectionNavItemData = { label: string; target: string }

/** `target` is the element id the link scrolls to; `label` is what the rail
 *  shows and what lights up. They can differ so that a row shared by two
 *  sections — Context beside My Role — reads as one entry. */
export function SectionNav({ items }: { items: SectionNavItemData[] }) {
  const [active, setActive] = useState(items[0]?.label ?? '')
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
      const first = document.getElementById(items[0].target)
      if (first) {
        const top = first.getBoundingClientRect().top
        setRailTop(Math.max(top, RAIL_PIN_TOP))
        setShown(top <= RAIL_REVEAL_TOP)
      }

      // A rail whose entries cannot be scrolled to is a rail that lies: the
      // document ran out before Impact could put its heading on the line, so
      // clicking it landed on the bottom of the page and lit whatever was
      // nearest. The page borrows the room to fix that — but only enough for
      // the second-to-last section, not the last. Buying the last one a scroll
      // to the top costs the better part of a screen of empty page, and it does
      // not need one: the bottom of the document is already its band, which is
      // what the `atBottom` rule below reads. This way the borrowing is a
      // hundred pixels rather than five hundred, and none at all on a width
      // that has no rail.
      const reachable = items[items.length - 2]
      const root = document.documentElement
      const el = reachable ? document.getElementById(reachable.target) : null
      // Read what is applied rather than remembering it: the measurement has to
      // subtract its own effect, and anything held in a ref goes stale the first
      // time the effect remounts with the padding already gone.
      const applied = parseFloat(getComputedStyle(root).getPropertyValue('--section-tail')) || 0
      const need = el && window.matchMedia(RAIL_QUERY).matches
        ? Math.max(0, (pageTop(el) - SCROLL_OFFSET) + BOTTOM_BAND
            - (root.scrollHeight - applied - window.innerHeight))
        : 0
      if (Math.abs(need - applied) > 1) root.style.setProperty('--section-tail', `${need}px`)

      if (pinned.current) return

      // The last section's band. It is too short to cross the line on its own
      // and, unlike the rest, it is not given the room to — so the foot of the
      // document is what claims it.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(items[items.length - 1].label)
        return
      }

      let current = items[0].label
      for (const item of items) {
        const el = document.getElementById(item.target)
        if (el && pageTop(el) <= line) current = item.label
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

  const handleSelect = useCallback((label: string) => {
    const item = items.find((i) => i.label === label)
    const el = item ? document.getElementById(item.target) : null
    if (!el) return

    pinned.current = label
    setActive(label)

    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = Math.min(Math.max(pageTop(el) - SCROLL_OFFSET, 0), Math.max(max, 0))
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

  const activeIndex = items.findIndex((it) => it.label === active)

  return (
    <nav
      aria-label="Case study sections"
      className="hidden min-[1200px]:block fixed z-30 w-8"
      // Not just invisible: nothing behind a transparent nav should take a
      // click, and a screen reader should not be offered a rail the page is
      // not showing yet.
      aria-hidden={!shown}
      style={{
        // The near side of the column, mirrored from the gutter the rail
        // used to sit in on the right: half the page, out past the 45rem of
        // content, then the same 2rem gutter.
        right: 'calc(50% + 22.5rem + 2rem)',
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
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => {
          const state: SectionState = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'upcoming'
          return (
            <SectionNavItem
              key={item.label}
              label={item.label}
              target={item.target}
              state={state}
              onSelect={handleSelect}
            />
          )
        })}
      </ul>
    </nav>
  )
}
