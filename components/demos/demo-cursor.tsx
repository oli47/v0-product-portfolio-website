'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MOVE_MS } from '@/components/demos/use-demo-script'

/**
 * Registry that maps a script's target keys to live DOM nodes, plus the fake
 * pointer that travels between them.
 *
 * The cursor measures targets against the stage and divides by the stage scale,
 * so it lands correctly at any container width without the script carrying a
 * single coordinate.
 */

const TargetContext = createContext<Map<string, HTMLElement> | null>(null)

export function TargetRegistry({ children }: { children: React.ReactNode }) {
  const map = useRef(new Map<string, HTMLElement>())
  return <TargetContext.Provider value={map.current}>{children}</TargetContext.Provider>
}

/** Ref callback that registers an element under `key` for the script to aim at. */
export function useTarget(key: string) {
  const map = useContext(TargetContext)
  return useCallback(
    (el: HTMLElement | null) => {
      if (!map) return
      if (el) map.set(key, el)
      else map.delete(key)
    },
    [map, key]
  )
}

interface DemoCursorProps {
  target: string | null
  pressed: boolean
  stageRef: React.RefObject<HTMLElement | null>
  scale: number
  /** Phones have no pointer, so the phone layout gets a tap dot instead. */
  touch?: boolean
}

export function DemoCursor({ target, pressed, stageRef, scale, touch = false }: DemoCursorProps) {
  const map = useContext(TargetContext)
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Clearing the target has to clear the point too, otherwise the pointer
    // stays parked wherever it last landed: visible on a demo that is at rest.
    if (!target) { setPoint(null); return }

    const stage = stageRef.current
    if (!map || !stage) return

    const measure = () => {
      const el = map.get(target)
      if (!el) return
      const a = el.getBoundingClientRect()
      const b = stage.getBoundingClientRect()
      // Read the effective scale off the DOM rather than trusting the prop: an
      // ancestor can add a transform of its own, as the home card does when it
      // lifts the screen on hover.
      const effective = b.width / stage.offsetWidth || 1
      setPoint({
        x: (a.left + a.width / 2 - b.left) / effective,
        y: (a.top + a.height / 2 - b.top) / effective,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [map, target, stageRef, scale])

  if (!point) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30"
      style={{
        transform: `translate3d(${point.x}px, ${point.y}px, 0)`,
        transition: `transform ${MOVE_MS}ms cubic-bezier(.4, 0, .2, 1)`,
      }}
    >
      {/* Ripple, drawn outwards from the contact point */}
      <div
        className="absolute rounded-full border-2"
        style={{
          left: touch ? -21 : -17,
          top: touch ? -21 : -17,
          width: touch ? 42 : 34,
          height: touch ? 42 : 34,
          borderColor: 'rgba(5, 5, 5, 0.22)',
          opacity: pressed ? 1 : 0,
          transform: `scale(${pressed ? 1 : 0.35})`,
          transition: pressed ? 'none' : 'opacity 340ms ease-out, transform 340ms ease-out',
        }}
      />

      {touch ? (
        // A fingertip, not a mouse pointer: centred on the target it taps.
        <div
          className="absolute rounded-full"
          style={{
            left: -14,
            top: -14,
            width: 28,
            height: 28,
            background: 'rgba(5, 5, 5, 0.26)',
            border: '1.5px solid rgba(5, 5, 5, 0.4)',
            transform: `scale(${pressed ? 0.86 : 1})`,
            transition: 'transform 110ms ease-out',
          }}
        />
      ) : (
        <svg
          width="26"
          height="30"
          viewBox="0 0 26 30"
          fill="none"
          style={{ transform: `scale(${pressed ? 0.88 : 1})`, transition: 'transform 110ms ease-out' }}
        >
          <path
            d="M2 1.6 22.4 15.1l-8.9 1.4 4.7 9.6-3.6 1.8-4.7-9.6L4 24.6 2 1.6Z"
            fill="#050505"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}
