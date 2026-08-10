'use client'

import { useEffect, useRef } from 'react'
import { clamp01, prefersReducedMotion } from '@/components/dither-kit/dither-paint'

// DitherWave — a decorative band on the charts' 2px cell
// (dither-kit/dither-paint.ts), with the same "solid at the floor, dissolving
// upward" falloff, but its own 8×8 ordered matrix (see BAYER8).
//
// Where it parts company with the charts: cells here are binary. The charts ride
// the alpha, which keeps small shapes readable but renders a large field as a
// smooth gradient wearing a dot texture. A band this size has to dither for
// real — every lit cell carries the same ink, and the ramp comes from how many
// of them clear the matrix.
//
// It reacts to nothing. Hovering PREV / NEXT used to steer it — lifting a swell
// under the cursor, then tilting, then setting the water flowing that way — and
// none of it read: the band sits ~200px below the links, so with the eye on the
// link the reaction happens outside attention and lands as something twitching
// at the foot of the page. The problem was the distance, not the effect.

const TAU = Math.PI * 2

// A wave is a surface: a body of water with an undulating top edge, rising from
// the bottom of the page.
//
// One smooth field, one screen. Everything that made earlier passes ugly came
// from adding structure on top of that — a second wave behind the first, then
// terraces to break up the ramp, then a different screen angle per terrace.
// Each fix was visible as a fix. An ordered screen already carries 64 levels;
// run a smooth ramp through the whole range and the gradient it draws is the
// effect. Nothing to add.
const CELL = 2
// The last rows go solid, so the page ends on an edge rather than a texture.
const FLOOR_SOLID = 0.05
// Ink every lit cell carries.
const INK = 0.8
// Shapes the ramp: above 1 it holds the sparse end longer, so the wave keeps a
// long airy fade at the crest and packs its dense half near the floor.
const FALLOFF = 1.5

// An 8×8 ordered (Bayer) matrix, sampled straight — no rotation. Rotating a
// discrete matrix does not rotate its pattern: sampling it along a turned axis
// aliases it, and the ordering that makes it a screen collapses into noise.
// (paper's `rotation` turns the *shape*, not the screen.) Sampled square, it
// draws the even, regular dot lattice it is supposed to.
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64))

// The interest is in the silhouette: three sines at unrelated frequencies, so
// the crest never settles into a shape the eye can predict.
const CREST = {
  base: 0.24,
  waves: [
    { amp: 0.17, freq: 0.9, phase: 0.05 },
    { amp: 0.07, freq: 2.2, phase: 0.61 },
    { amp: 0.035, freq: 3.7, phase: 0.23 },
  ],
} as const
// Cycles per second the crest slides sideways.
const DRIFT = 0.16
// The crest never rises above this fraction of the band — three sines could
// otherwise align near the top edge, and the footer type overlaps that strip.
const CEILING = 0.1
// Width of the soft landing into the ceiling, in the same units. Narrow, so the
// tallest crests hug the ceiling instead of being held well under it — that is
// what keeps the gap between type and water even across the whole band.
const SOFT = 0.03

// The drift slides the wave sideways; this bobs the whole surface, so it is
// never just a rigid shape scrolling past.
const SWELL_RATE = 0.22
const SWELL_DEPTH = 0.03

// Ambient motion does not need 60fps, and every frame costs a full repaint of
// the band. Capped, the drift is indistinguishable and half as expensive.
const FRAME_MS = 1000 / 30

/** Height of the crest at `u`, as a fraction of the band (0 = top edge). */
function crestAt(u: number, t: number) {
  let crest = CREST.base - SWELL_DEPTH * Math.sin(TAU * (t * SWELL_RATE))
  for (let i = 0; i < CREST.waves.length; i++) {
    const w = CREST.waves[i]
    // Each harmonic travels at its own rate — one shared slide would just
    // scroll the whole silhouette past, which reads as a texture on a conveyor.
    const at = w.phase + t * DRIFT * (i % 2 ? -0.6 : 1)
    crest -= w.amp * Math.sin(TAU * (w.freq * u + at))
  }
  // Softplus rather than Math.max: the ceiling has to be a guarantee, since the
  // footer type sits inside the band's top edge and only stays clear because
  // the water cannot reach it. A hard clamp would flatten the tallest crests
  // into a straight line; this compresses them into it.
  return CEILING + SOFT * Math.log1p(Math.exp((crest - CEILING) / SOFT))
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

// ImageData is byte-ordered RGBA; a Uint32 view packs it in the machine's byte
// order, so which end the alpha sits on depends on the platform.
const littleEndian =
  typeof Uint8Array === 'undefined' ||
  new Uint8Array(new Uint32Array([1]).buffer)[0] === 1

type Rgb = [number, number, number]

/** The live `--accent`, so the band follows the theme toggle. */
function readAccent(el: HTMLElement): Rgb {
  const raw = getComputedStyle(el).getPropertyValue('--accent').trim()
  const hex = /^#?([0-9a-f]{6})$/i.exec(raw)
  if (!hex) return [184, 74, 18]
  const n = parseInt(hex[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function DitherWave({ height = 88, className }: { height?: number; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offRef = useRef<HTMLCanvasElement | null>(null)
  const octxRef = useRef<CanvasRenderingContext2D | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const imageRef = useRef<ImageData | null>(null)
  const bufRef = useRef<Uint32Array | null>(null)
  const raf = useRef<number | null>(null)
  const tickRef = useRef<(() => void) | null>(null)
  const phase = useRef(0)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    // One `fillRect` per cell means tens of thousands of canvas calls (each
    // parsing a fresh `rgba(...)` string) for a band this wide — that is what
    // made the swell stutter. The cells are written straight into an ImageData
    // buffer as packed 32-bit pixels instead, and the whole low-res frame is
    // blitted in one `putImageData` + one scaled `drawImage`.
    const paint = () => {
      const width = host.clientWidth
      if (width <= 0) return

      const cols = Math.max(8, Math.round(width / CELL))
      const rows = Math.max(8, Math.round(height / CELL))
      const off = (offRef.current ??= document.createElement('canvas'))
      const octx = (octxRef.current ??= off.getContext('2d', { alpha: true }))
      if (!octx) return
      if (off.width !== cols || off.height !== rows) {
        off.width = cols
        off.height = rows
        imageRef.current = octx.createImageData(cols, rows)
        bufRef.current = new Uint32Array(imageRef.current.data.buffer)
      }
      const image = imageRef.current
      const buf = bufRef.current
      if (!image || !buf) return
      buf.fill(0)

      const [r, g, b] = readAccent(host)
      // Packed once: alpha is the only channel that varies per cell (see the
      // colour-vs-opacity note in dither-kit/dither-paint.ts).
      const rgbBits = littleEndian ? r | (g << 8) | (b << 16) : (r << 24) | (g << 16) | (b << 8)
      // Same alpha does not read the same on both themes: the dark accent is a
      // brighter orange and the ground behind it is near-black, so the band that
      // sits right on the light page glares on the dark one.
      const themeScale = document.documentElement.classList.contains('dark') ? 0.68 : 1
      // Every lit cell carries the same ink, so it is packed once for the frame.
      const inkAlpha = Math.round(clamp01(INK * themeScale) * 255)
      const ink = littleEndian ? rgbBits | (inkAlpha << 24) : rgbBits | inkAlpha
      const FLOOR = 1 - FLOOR_SOLID

      for (let cx = 0; cx < cols; cx++) {
        const u = (cx + 0.5) / cols
        const crest = crestAt(u, phase.current)

        // Normalised over the water's own depth, so the ramp always spans the
        // full range whatever height the crest is at — every one of the
        // screen's 64 levels gets used, top to bottom.
        const span = Math.max(FLOOR - crest, 0.02)
        for (let cy = Math.max(0, Math.floor(crest * rows)); cy < rows; cy++) {
          const v = (cy + 0.5) / rows
          if (v <= crest) continue
          if (v < FLOOR) {
            const d = Math.pow(clamp01((v - crest) / span), FALLOFF)
            if (d <= BAYER8[cy & 7][cx & 7]) continue
          }
          buf[cy * cols + cx] = ink
        }
      }

      octx.putImageData(image, 0, 0)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = Math.round(width * dpr)
      const ch = Math.round(height * dpr)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      }
      const ctx = (ctxRef.current ??= canvas.getContext('2d'))
      if (!ctx) return
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(off, 0, 0, cw, ch)
    }

    // The clock is wall-time, not a frame counter, but it is rebased against the
    // phase the wave had already reached whenever the loop restarts — so pausing
    // off-screen costs the drift nothing, and resuming never jumps.
    let origin = 0
    let last = 0
    let rebase = true
    // Starts true: if the observer never reports — no support, a tab that is
    // not rendering — a wave frozen for good is the worse failure.
    let onScreen = true

    const drifting = () => onScreen && !prefersReducedMotion() && !document.hidden

    const frame = (t: number) => {
      raf.current = null
      if (rebase) {
        origin = t - phase.current * 1000
        last = t
        rebase = false
      }
      // Time-based, not a fixed fraction per frame: a share-per-frame ease runs
      // at whatever rate the frames happen to arrive, which is exactly what made
      // the swell feel abrupt. Capped, so a long stall does not jump.
      const drift = drifting()
      if (!drift) return
      phase.current = (t - origin) / 1000

      if (t - last >= FRAME_MS) {
        last = t
        paint()
      }
      raf.current = requestAnimationFrame(frame)
    }

    tickRef.current = () => {
      // Nothing to animate with: rAF never fires in a hidden tab, and reduced
      // motion asks for a still band. Paint the frame it should be showing and
      // leave it there.
      if (prefersReducedMotion() || document.hidden) {
        paint()
        return
      }
      // Cancel-then-schedule rather than "schedule only if idle": a frame
      // requested while the tab was hidden never runs, and its id would
      // otherwise sit in `raf` forever and swallow every later tick.
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      rebase = true
      raf.current = requestAnimationFrame(frame)
    }

    paint()

    const ro = new ResizeObserver(paint)
    ro.observe(host)
    // Repaint on the theme toggle — `--accent` differs between light and dark.
    const mo = new MutationObserver(paint)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    // The footer sits below the fold on every page; a band nobody can see has no
    // business repainting 30 times a second.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) tickRef.current?.()
      },
      { rootMargin: '120px' }
    )
    io.observe(host)
    tickRef.current()
    const onVisibility = () => tickRef.current?.()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      tickRef.current = null
      if (raf.current !== null) cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [height])

  return (
    <div ref={hostRef} className={className} style={{ height }} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
    </div>
  )
}
