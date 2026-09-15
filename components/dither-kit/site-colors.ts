// Not a vendored file — dither-kit resolves a series colour through a static
// `PALETTE` keyed by name, so the only way to make a chart follow the site's
// own CSS custom properties (which flip between themes) is to read the
// property at runtime, rewrite the seed, and hand the chart a fresh `config`
// object (it memoises its colour lookup on `config` identity). Shared here
// because `cohort-chart.tsx` and `breakdown-chart.tsx` both need it.

import type { Rgb } from './palette'

export const hexToRgb = (hex: string): Rgb | null => {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Lightens `[r,g,b]` toward white by `amount` (0-1) — how `PALETTE`'s own
 *  seeds relate their bright `line`/`star` tones to a darker `fill`. */
export const mix = ([r, g, b]: Rgb, amount: number): Rgb => [
  Math.round(r + (255 - r) * amount),
  Math.round(g + (255 - g) * amount),
  Math.round(b + (255 - b) * amount),
]
