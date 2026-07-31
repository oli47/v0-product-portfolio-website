'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Plays a scripted walkthrough of a product UI: moves a fake cursor between
 * targets, types into fields, and swaps screens. Nothing here knows about a
 * specific app — the screens read `DemoState` and render themselves.
 *
 * Cursor position is stored as a *target key*, not coordinates. The cursor
 * component resolves the key against the live DOM, so the script stays correct
 * when the stage is rescaled or the layout reflows.
 */

export type Step =
  | { kind: 'wait';   ms: number }
  | { kind: 'move';   target: string }
  | { kind: 'click';  target: string }
  | { kind: 'type';   field: string; text: string; cps?: number }
  | { kind: 'set';    field: string; text: string }
  | { kind: 'screen'; index: number }

export interface DemoState {
  screen: number
  values: Record<string, string>
  /** Field key showing a focus ring and a caret. */
  focus: string | null
  /** Target key currently held down, for the pressed-state style. */
  pressed: string | null
  /** Target key the cursor sits on, or null before the first move. */
  cursor: string | null
}

const EMPTY: DemoState = { screen: 0, values: {}, focus: null, pressed: null, cursor: null }

/** Cursor travel time. Matches the CSS transition in demo-cursor.tsx. */
export const MOVE_MS = 480
const PRESS_MS = 90
const AFTER_CLICK_MS = 160
const DEFAULT_CPS = 20

/** Keystrokes land unevenly, otherwise typing reads as a machine, not a person. */
const keystrokeDelay = (cps: number) => (1000 / cps) * (0.7 + Math.random() * 0.7)

/**
 * @param rest  What the demo shows while the script is not running: its poster
 *              frame. Pass a module constant, not an object literal, or every
 *              render restarts the script.
 */
export function useDemoScript(script: Step[], enabled: boolean, rest?: Partial<DemoState>) {
  const poster = useMemo(() => ({ ...EMPTY, ...rest }), [rest])
  const [state, setState] = useState<DemoState>(poster)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    // Not playing means showing the poster. That covers three cases with one
    // rule: scrolled away, never asked to play, and reduced motion. It also
    // stops a hovered-then-left card from freezing on a half-typed word.
    if (!enabled) { setState(poster); return }

    let cancelled = false
    const pending = timers.current

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(() => { pending.delete(id); resolve() }, ms)
        pending.add(id)
      })

    const apply = async (step: Step) => {
      switch (step.kind) {
        case 'wait':
          await sleep(step.ms)
          return

        case 'move':
          setState((s) => ({ ...s, cursor: step.target }))
          await sleep(MOVE_MS)
          return

        case 'click':
          setState((s) => ({ ...s, cursor: step.target, pressed: step.target }))
          await sleep(PRESS_MS)
          setState((s) => ({ ...s, pressed: null }))
          await sleep(AFTER_CLICK_MS)
          return

        case 'type': {
          setState((s) => ({ ...s, focus: step.field, values: { ...s.values, [step.field]: '' } }))
          const cps = step.cps ?? DEFAULT_CPS
          for (const char of step.text) {
            await sleep(keystrokeDelay(cps))
            if (cancelled) return
            setState((s) => ({ ...s, values: { ...s.values, [step.field]: s.values[step.field] + char } }))
          }
          return
        }

        case 'set':
          setState((s) => ({ ...s, values: { ...s.values, [step.field]: step.text } }))
          return

        case 'screen':
          setState((s) => ({ ...s, screen: step.index, focus: null, cursor: null, pressed: null }))
          await sleep(220)   // let the cross-fade finish before the next step
          return
      }
    }

    const run = async () => {
      setState(EMPTY)
      while (!cancelled) {
        for (const step of script) {
          if (cancelled) return
          await apply(step)
        }
        setState(EMPTY)
        await sleep(600)
      }
    }

    void run()

    return () => {
      cancelled = true
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [enabled, script, poster])

  return state
}
