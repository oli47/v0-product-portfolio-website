'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DemoCursor, TargetRegistry } from '@/components/demos/demo-cursor'
import { metricsFor, type DemoVariant, type Metrics } from '@/components/demos/edrone-ui'
import { useDemoScript, type DemoState, type Step } from '@/components/demos/use-demo-script'

/**
 * Shell for a coded product-UI demo.
 *
 * The screens are authored at a fixed design size and scaled to whatever width
 * the column gives them, so proportions stay identical to the original app. The
 * design size itself switches with the column: a wide column gets the desktop
 * layout, a narrow one gets the phone layout rather than a shrunken desktop.
 *
 * It plays like a video, with nothing for the visitor to click. Left alone it
 * loops while on screen; give it `play` and it becomes controlled, which is how
 * the home page card animates on hover and sits still otherwise.
 */

// Layout effects run before paint, so the frame never flashes the desktop
// layout on a phone. On the server there is nothing to measure.
const useMeasure = typeof window === 'undefined' ? useEffect : useLayoutEffect

interface DemoFrameProps {
  script: Step[]
  /** The frame's state whenever the script is not running: its poster frame.
   *  Must be a module constant — it feeds the script effect's deps. */
  restState: Partial<DemoState>
  children: (state: DemoState, m: Metrics) => React.ReactNode
  /** Plays exactly while true. Omit it and the frame plays while on screen. */
  play?: boolean
  variant?: DemoVariant
}

/** What a demo component takes and forwards straight to its frame. */
export type DemoProps = Pick<DemoFrameProps, 'play' | 'variant'>

export function DemoFrame({ script, restState, children, play, variant = 'inline' }: DemoFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const [hostWidth, setHostWidth] = useState(0)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)

  const m = metricsFor(hostWidth, variant)
  const scale = hostWidth > 0 ? hostWidth / m.stageW : 1

  // Reduced motion never plays, so it lands on the poster like anything else.
  const state = useDemoScript(script, (play ?? inView) && !reduced, restState)

  // Scale the fixed-size stage down to the column width.
  useMeasure(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setHostWidth(host.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  // Only animate what the visitor can actually see. Skipped entirely when the
  // caller drives playback.
  useEffect(() => {
    const host = hostRef.current
    if (!host || play !== undefined) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [play])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="relative w-full select-none overflow-hidden rounded-[0.125rem] bg-white"
      style={{ aspectRatio: `${m.stageW} / ${m.stageH}` }}
    >
      <TargetRegistry>
        <div
          ref={stageRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: m.stageW,
            height: m.stageH,
            transform: `scale(${scale})`,
            // Before the first measurement the stage is full size inside a much
            // smaller host. The host keeps its aspect ratio either way, so
            // hiding costs a frame and no layout shift.
            visibility: hostWidth ? undefined : 'hidden',
          }}
        >
          {children(state, m)}
          <DemoCursor
            target={state.cursor}
            pressed={state.pressed !== null}
            stageRef={stageRef}
            scale={scale}
            touch={m.mobile}
          />
        </div>
      </TargetRegistry>
    </div>
  )
}
