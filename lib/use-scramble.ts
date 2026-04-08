'use client'

import { useRef, useEffect, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function useScramble(word: string) {
  const spanRef  = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    const el = spanRef.current
    if (!el) return
    if (timerRef.current) clearInterval(timerRef.current)
    let n = 0; const max = 14
    timerRef.current = setInterval(() => {
      el.textContent = word.split('').map((c, i) =>
        n / max > i / word.length ? c : CHARS[Math.floor(Math.random() * 26)]
      ).join('')
      if (++n > max) { clearInterval(timerRef.current!); el.textContent = word }
    }, 28)
  }, [word])

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (spanRef.current) spanRef.current.textContent = word
  }, [word])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  return { spanRef, scramble, reset }
}
