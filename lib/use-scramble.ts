'use client'

import { useRef, useEffect, useCallback } from 'react'

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const FRAMES   = 14
const FRAME_MS = 28

const isAlphaNum = (char: string) =>
  (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9')

let measureCtx: CanvasRenderingContext2D | null = null
const widthTables = new Map<string, { char: string; width: number }[]>()

function contextFor(font: string) {
  measureCtx ||= document.createElement('canvas').getContext('2d')
  if (measureCtx) measureCtx.font = font
  return measureCtx
}

function fontOf(el: HTMLElement) {
  const style = getComputedStyle(el)
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
}

/**
 * Candidate glyphs for `char`, restricted to ones that render at the same
 * width in this font. Random letters of the wrong width would make every word
 * change length mid-animation, which re-wraps lines and shoves the layout
 * around; matching the advance width keeps the text noisy but immobile.
 */
function lookalikes(char: string, font: string) {
  const ctx = contextFor(font)
  if (!ctx) return POOL.split('')

  let table = widthTables.get(font)
  if (!table) {
    table = POOL.split('').map((c) => ({ char: c, width: ctx.measureText(c).width }))
    widthTables.set(font, table)
  }

  const width = ctx.measureText(char).width
  const tolerance = Math.max(0.25, width * 0.02)
  const matches = table.filter((e) => e.char !== char && Math.abs(e.width - width) <= tolerance)

  // Nothing of that width to swap in — leave the character alone rather than
  // let it shift the line.
  return matches.length ? matches.map((e) => e.char) : [char]
}

/**
 * Decodes `text` into `el` left to right. Returns a stop function that clears
 * the timer and restores the final text.
 */
export function scrambleInto(el: HTMLElement, text: string) {
  const font = fontOf(el)
  const options = new Map<string, string[]>()
  for (const char of text) {
    if (isAlphaNum(char) && !options.has(char)) options.set(char, lookalikes(char, font))
  }

  let frame = 0
  const timer = setInterval(() => {
    const progress = frame / FRAMES
    let out = ''

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      // Spaces and punctuation never scramble: they carry the word boundaries
      // and line break opportunities.
      if (!isAlphaNum(char) || progress > i / text.length) {
        out += char
      } else {
        const pool = options.get(char)!
        out += pool[Math.floor(Math.random() * pool.length)]
      }
    }

    el.textContent = out
    if (++frame > FRAMES) {
      clearInterval(timer)
      el.textContent = text
    }
  }, FRAME_MS)

  return () => {
    clearInterval(timer)
    el.textContent = text
  }
}

export function useScramble(word: string) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const stopRef = useRef<(() => void) | null>(null)

  const scramble = useCallback(() => {
    const el = spanRef.current
    if (!el) return
    stopRef.current?.()
    stopRef.current = scrambleInto(el, word)
  }, [word])

  const reset = useCallback(() => {
    stopRef.current?.()
    stopRef.current = null
  }, [])

  useEffect(() => () => { stopRef.current?.() }, [])

  return { spanRef, scramble, reset }
}
