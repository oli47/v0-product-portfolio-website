'use client'

import { useEffect, useRef } from 'react'
import { scrambleInto } from '@/lib/use-scramble'

/**
 * Decodes its text whenever `active` flips on — for text driven by a parent's
 * hover rather than its own. Inherits type styles from whatever wraps it.
 */
export function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return scrambleInto(el, text)
  }, [active, text])

  return <span ref={ref}>{text}</span>
}
