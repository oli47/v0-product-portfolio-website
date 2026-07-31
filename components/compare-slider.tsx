'use client'

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'

/**
 * Before / after comparison of two versions of the same screen.
 *
 * Content-agnostic: the sides are nodes, so a comparison can be two screenshots
 * or two coded demos playing side by side. Screenshots cannot size themselves
 * (`fill` images need a sized parent), so those pass `aspectRatio`; a demo sizes
 * its own frame and the after side sets the height for both.
 *
 * A drag handle needs a pointer and horizontal room, so below `sm` this becomes
 * a pair of tabs instead. Only the visible side is mounted, so a phone never
 * runs two walkthroughs at once.
 */

/** Tailwind's `sm`. Below it, tabs. */
const TABS_BELOW = 640

/** Opening position, as a percentage from the left. Far enough left that the
 *  after side is what you actually see, with the before side as a sliver. */
const START_AT = 12

const useMeasure = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Before / After chip. Both states carry a border so only colours change across
 * the swap, which is what makes the crossfade read as one chip changing rather
 * than two chips resizing.
 */
const chip = (active: boolean) =>
  `absolute top-4 z-20 text-eyebrow rounded-[0.125rem] border px-2 py-1 shadow-sm transition-colors duration-[400ms] ease-in-out ${
    active
      ? 'border-transparent bg-[var(--accent)] text-white'
      : 'border-[var(--color-150)] bg-[var(--color-step-bg)] text-[var(--color-300)]'
  }`

interface CompareProps {
  before: React.ReactNode
  after: React.ReactNode
  beforeLabel: string
  afterLabel: string
  /** Only for content that cannot size itself. */
  aspectRatio?: string
}

export function CompareSlider(props: CompareProps) {
  const [tabs, setTabs] = useState(false)

  useMeasure(() => {
    const query = window.matchMedia(`(max-width: ${TABS_BELOW - 1}px)`)
    setTabs(query.matches)
    const onChange = (e: MediaQueryListEvent) => setTabs(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return tabs ? <CompareTabs {...props} /> : <CompareDrag {...props} />
}

// ─── Drag (pointer) ──────────────────────────────────────────────────────────

function CompareDrag({ before, after, beforeLabel, afterLabel, aspectRatio }: CompareProps) {
  const [sliderPosition, setSliderPosition] = useState(START_AT)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPosition(p => Math.max(p - 5, 0))
    if (e.key === 'ArrowRight') setSliderPosition(p => Math.min(p + 5, 100))
  }, [])

  // Always listen for mouseup/touchend to stop dragging
  useEffect(() => {
    const stop = () => setIsDragging(false)
    document.addEventListener('mouseup', stop)
    document.addEventListener('touchend', stop, { passive: true })
    return () => {
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('touchend', stop)
    }
  }, [])

  // Only attach move listeners while dragging
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => { if (e.touches[0]) handleMove(e.touches[0].clientX) }
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging, handleMove])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)] select-none cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        ...(aspectRatio ? { aspectRatio } : null),
        // A touchscreen may still reach this at desktop widths. Let the page
        // scroll vertically, but keep a sideways drag from panning it.
        touchAction: 'pan-y',
      }}
      role="slider"
      aria-label="Before / After comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onKeyDown={handleKeyDown}
    >
      {/* After — in flow when there is no fixed ratio, so it sets the height */}
      <div className={aspectRatio ? 'absolute inset-0' : ''}>{after}</div>

      {/* Before — same box, clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        {before}
      </div>

      {/* Drag handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[var(--color-500)] z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--background)] rounded-sm shadow-md flex items-center justify-center border border-[var(--color-100)]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--color-400)]">
            <path d="M7 6L3 10L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 6L17 10L13 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels — whichever side holds more than half the frame is the one in
          accent, so the chips answer "what am I mostly looking at" and swap
          across the midpoint instead of sitting fixed. */}
      <div className={`${chip(sliderPosition > 50)} left-4`}>{beforeLabel}</div>
      <div className={`${chip(sliderPosition <= 50)} right-4`}>{afterLabel}</div>
    </div>
  )
}

// ─── Tabs (phone) ────────────────────────────────────────────────────────────

function CompareTabs({ before, after, beforeLabel, afterLabel, aspectRatio }: CompareProps) {
  const [showAfter, setShowAfter] = useState(true)

  // Half the width each, and tall enough to be a comfortable thumb target.
  const tab = (active: boolean) =>
    `flex-1 text-eyebrow rounded-[0.125rem] px-3 py-3 transition-colors duration-200 ${
      active
        // Transparent border, not none: with `flex-basis: 0` a border widens the
        // box, so without it the two tabs come out 2px apart instead of 50/50.
        ? 'border border-transparent bg-[var(--accent)] text-white'
        : 'border border-[var(--color-150)] bg-[var(--color-step-bg)] text-[var(--color-300)]'
    }`

  return (
    <div>
      <div role="tablist" aria-label="Before / After comparison" className="mb-2 flex w-full gap-2">
        <button type="button" role="tab" aria-selected={!showAfter} className={tab(!showAfter)} onClick={() => setShowAfter(false)}>
          {beforeLabel}
        </button>
        <button type="button" role="tab" aria-selected={showAfter} className={tab(showAfter)} onClick={() => setShowAfter(true)}>
          {afterLabel}
        </button>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-sm border border-[var(--color-100)]"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className={aspectRatio ? 'absolute inset-0' : ''}>{showAfter ? after : before}</div>
      </div>
    </div>
  )
}
