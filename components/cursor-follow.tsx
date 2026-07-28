'use client'

import { useCallback, useEffect, useRef } from 'react'

// Same spring animate-ui's CursorFollow uses by default:
// { stiffness: 500, damping: 50, bounce: 0 } — slightly overdamped, so it
// catches up to the pointer without overshooting.
const STIFFNESS = 500
const DAMPING = 50
const MAX_FRAME = 1 / 30   // clamp long frames so the integration stays stable
const SETTLED = 0.1        // px / px-per-second below which we stop the loop

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Makes the `followRef` element trail the pointer inside `areaRef`.
 *
 * The follow element is placed from the area's top-left corner, so it needs
 * `absolute left-0 top-0` and must not carry a transform of its own — this
 * hook writes `transform` straight to the node, outside React's render loop.
 */
export function useCursorFollow<A extends HTMLElement, F extends HTMLElement>() {
  const areaRef = useRef<A>(null)
  const followRef = useRef<F>(null)

  const target = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const frame = useRef<number | null>(null)
  const lastTime = useRef(0)
  const reduceMotion = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion.current = query.matches
    const onChange = (e: MediaQueryListEvent) => { reduceMotion.current = e.matches }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  const draw = useCallback(() => {
    const follow = followRef.current
    if (follow) {
      follow.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`
    }
  }, [])

  // Pointer position relative to the area, clamped so the element never gets
  // clipped by the area's overflow.
  const measure = useCallback((clientX: number, clientY: number) => {
    const area = areaRef.current
    const follow = followRef.current
    if (!area || !follow) return
    const bounds = area.getBoundingClientRect()
    target.current = {
      x: clamp(clientX - bounds.left, 0, bounds.width - follow.offsetWidth),
      y: clamp(clientY - bounds.top, 0, bounds.height - follow.offsetHeight),
    }
  }, [])

  const tick = useCallback((time: number) => {
    const delta = Math.min((time - lastTime.current) / 1000, MAX_FRAME)
    lastTime.current = time

    let settled = true
    for (const axis of ['x', 'y'] as const) {
      const displacement = position.current[axis] - target.current[axis]
      const acceleration = -STIFFNESS * displacement - DAMPING * velocity.current[axis]
      velocity.current[axis] += acceleration * delta
      position.current[axis] += velocity.current[axis] * delta
      if (Math.abs(displacement) > SETTLED || Math.abs(velocity.current[axis]) > SETTLED) {
        settled = false
      }
    }

    draw()
    frame.current = settled ? null : requestAnimationFrame(tick)
  }, [draw])

  const start = useCallback(() => {
    if (frame.current !== null) return
    lastTime.current = performance.now()
    frame.current = requestAnimationFrame(tick)
  }, [tick])

  const onMouseEnter = useCallback((e: React.MouseEvent) => {
    measure(e.clientX, e.clientY)
    // Appear under the pointer, then trail it from there.
    position.current = { ...target.current }
    velocity.current = { x: 0, y: 0 }
    draw()
  }, [draw, measure])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    measure(e.clientX, e.clientY)
    if (reduceMotion.current) {
      position.current = { ...target.current }
      draw()
      return
    }
    start()
  }, [draw, measure, start])

  const onMouseLeave = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [])

  return { areaRef, followRef, handlers: { onMouseEnter, onMouseMove, onMouseLeave } }
}
