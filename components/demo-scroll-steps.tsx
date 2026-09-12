'use client'

import { useEffect, useRef, useState } from 'react'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import type { DemoId } from '@/lib/projects'

/**
 * A demo pinned beside prose that changes like slides as the reader scrolls —
 * one step's text on screen at a time, crossfading into the next, not a
 * column of paragraphs scrolling past. One demo instance for the whole
 * block — each step just re-pins it to its own screen/values.
 *
 * The mechanism: an invisible track (`trackRef`), tall enough to give
 * `STEP_SCROLL` px of scroll to each step, holds a `position: sticky` panel
 * (`pinnedRef`) that pins in place once its track's top reaches the reading
 * line. How far the reader has scrolled into the track's own extra height —
 * the part beyond the panel's own height, which is the only part that
 * actually scrolls while the panel is stuck — is the progress that picks the
 * active step. No `IntersectionObserver`: a rAF-throttled scroll listener,
 * the same idiom `section-nav.tsx` uses for its own current-section rule.
 */

export interface ScrollStep {
  text: string[]
  pinnedScreen?: number
  pinnedValues?: Record<string, string>
}

/** How far below the fixed nav the pinned panel sits. Same neighbourhood as
 *  section-nav.tsx's SCROLL_OFFSET/RAIL_PIN_TOP (120/160). */
const STICKY_TOP = 120

/** Scroll it takes to advance one step. The card no longer grows with this
 *  (it hugs its own content, not the track), so there is no cost to making it
 *  generous: too short and an ordinary scroll gesture — a wheel notch, a
 *  trackpad flick — sails past two or three steps before the reader can
 *  register the first one changed. */
const STEP_SCROLL = 800

/** How far a leaving/arriving slide sits off its resting spot. Opacity alone
 *  read as a plain cross-dissolve — easy to miss mid-scroll — so slides also
 *  travel a short distance in the scroll direction, which is what reads as a
 *  slide changing rather than a picture quietly fading. */
const SLIDE_OFFSET = 18

export function DemoScrollSteps({ demo, steps }: { demo: DemoId; steps: ScrollStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  // Continuous 0-1 position through the whole track, not just the active
  // index — the progress rail needs the in-between value too, or it would
  // jump in five steps instead of reading as motion.
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const track = trackRef.current
      const pinned = pinnedRef.current
      if (!track || !pinned) return

      const trackTop = track.getBoundingClientRect().top + window.scrollY
      // How far past the point where the panel starts sticking. The panel's
      // own height is not scroll the reader spends stepping — only the
      // track's extra length beyond it is.
      const scrolled = window.scrollY + STICKY_TOP - trackTop
      const range = Math.max(track.offsetHeight - pinned.offsetHeight, 1)
      setProgress(Math.min(Math.max(scrolled / range, 0), 1))
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
  }, [steps.length])

  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length))
  const current = steps[active] ?? steps[0]

  return (
    // The track is the scroll mechanism, not a visible thing: it holds no
    // background of its own, so scrolling through its (mostly empty) height
    // shows plain page background, not a giant card. The card is the pinned
    // panel below, sized to its own content the way every other block's card
    // is — `p-6 sm:p-10` matches `FRAME_PAD` in process-blocks.tsx; duplicated
    // rather than imported, to avoid a cycle with the file that imports this
    // component.
    <div ref={trackRef} style={{ height: STEP_SCROLL * steps.length }} className="relative">
      <div
        ref={pinnedRef}
        className="sticky w-full rounded-sm p-6 sm:p-10"
        style={{ top: STICKY_TOP, backgroundColor: 'var(--color-000)' }}
      >
        <div className="relative flex flex-col gap-6 pl-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-12 lg:pl-6">
          {/* The progress rail. One track the height of the panel, filled from
              the top by the same continuous value the slides key off — a
              reader who scrolls past too fast to catch a crossfade still sees
              this move, which is the whole point of it existing. */}
          <div
            className="absolute bottom-0 left-0 top-0 w-[3px] overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--color-100)' }}
            aria-hidden
          >
            <div
              className="w-full rounded-full"
              style={{
                height: `${progress * 100}%`,
                backgroundColor: 'var(--accent)',
                transition: 'height 120ms linear',
              }}
            />
          </div>

          {/* The slide stack. Every step is mounted the whole time — nothing
              to mount mid-scroll — and only the active one is opaque and can
              be read; `min-h` is the floor `flex-col` needs on a narrow
              window, where there is no sibling row height to stretch to
              instead. */}
          <div className="relative min-h-[12rem]">
            {steps.map((step, i) => {
              const offset = i === active ? 0 : i < active ? -SLIDE_OFFSET : SLIDE_OFFSET
              return (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className="absolute inset-0 flex flex-col justify-center gap-4 transition-[opacity,transform] duration-500 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translateY(${offset}px)`,
                    pointerEvents: i === active ? 'auto' : 'none',
                  }}
                >
                  {step.text.map((text, j) => (
                    <p key={j} className="text-body-2 text-[var(--color-500)] text-pretty">
                      <Bold text={text} />
                    </p>
                  ))}
                </div>
              )
            })}
          </div>

          <div className="relative">
            {/* Fires once per step change, not tied to whatever the demo
                itself is doing — a phone field collapsing is a small, easy
                thing to miss beside a whole paragraph changing; this is the
                "look here, this side changed too" the panel otherwise lacks. */}
            <div
              key={active}
              aria-hidden
              className="demo-step-flash pointer-events-none absolute -inset-1 rounded-[0.25rem]"
              style={{ boxShadow: '0 0 0 3px var(--accent)' }}
            />
            <div className="rounded-[0.125rem] overflow-hidden">
              <ClickableDemo
                id={demo}
                label="Product walkthrough"
                pinnedScreen={current.pinnedScreen}
                pinnedValues={current.pinnedValues}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
