'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { Area } from '@/components/dither-kit/area'
import { AreaChart } from '@/components/dither-kit/area-chart'
import { PALETTE } from '@/components/dither-kit/palette'
import { hexToRgb, mix } from '@/components/dither-kit/site-colors'

export type BreakdownChart = {
  /** Each channel's own share of total traffic (0-1). This is what turns a
   *  rate into its slice of the combined bar — a 1% desktop rate and a
   *  0.05% mobile rate aren't parts of one whole at their own scale, only
   *  once weighted by how much traffic each channel actually carries. */
  channels: { key: string; label: string; share: number }[]
  /** Each channel's own conversion rate (percentage points), before. */
  before: Record<string, number>
  after: Record<string, number>
  /** The measured total, before and after (percent). Its own fact, not the
   *  channels' blend: see `signup-redesign`'s `share`. */
  total: { before: number; after: number }
}

/**
 * The Outcome card's channel split, as one stacked area under two points
 * (Before, After) instead of flat number cards beside the north star. The
 * curve's height at each point is its channels' rates turned into their
 * share of the combined total, so the rise from "Before" to "After" *is*
 * the published north star (+200%): `channels[].share` is picked so the
 * blend lands on that independently-measured total, which is a looser fit
 * than the "about 85%" desktop split the prose beside it states — the
 * north star here is a fact in its own right, not something derived from
 * the per-channel numbers. The stack order puts the smaller,
 * faster-growing channel at the base and the larger one on top of it, so
 * mobile going from invisible to a real band reads as exactly that.
 *
 * No tooltip, grid or legend: the numbers a reader recognises, each channel's
 * own rate and growth, sit under the chart as text (`ImpactSummaryCard`).
 */
export function BreakdownAreaChart({ chart }: { chart: BreakdownChart }) {
  const { resolvedTheme } = useTheme()
  const [seedTick, setSeedTick] = useState(0)

  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const accent = hexToRgb(style.getPropertyValue('--accent'))
    const accentGreen = hexToRgb(style.getPropertyValue('--accent-green'))
    if (!accent || !accentGreen) return
    // The site's two brand colours, not two shades of one hue that read as
    // "the same colour" at a glance.
    PALETTE.orange = { fill: accent, line: mix(accent, 0.45), star: mix(accent, 0.7) }
    PALETTE.green = { fill: accentGreen, line: mix(accentGreen, 0.45), star: mix(accentGreen, 0.7) }
    setSeedTick((t) => t + 1)
  }, [resolvedTheme])

  const data = useMemo(
    () => [
      { label: 'Before', ...Object.fromEntries(chart.channels.map((c) => [c.key, chart.before[c.key] * c.share])) },
      { label: 'After', ...Object.fromEntries(chart.channels.map((c) => [c.key, chart.after[c.key] * c.share])) },
    ],
    [chart]
  )

  // `config`'s own key order drives the stack, first key = base layer:
  // reversed, so mobile sits at the base.
  const config = useMemo(
    () => Object.fromEntries(
      [...chart.channels].reverse().map((c) => [
        c.key,
        { label: c.label, color: c.key === chart.channels[0]?.key ? ('orange' as const) : ('green' as const) },
      ])
    ),
    // seedTick is the dep that forces the colour lookup to re-run after the
    // seed is rewritten above.
    [chart, seedTick]
  )

  return (
    <figure>
      <AreaChart
        data={data}
        config={config}
        stackType="stacked"
        // Tall on purpose: the fill is drawn in 2px cells, so a shallow
        // slope steps. At 96px the rise was one cell every ~20px of width,
        // a visible staircase; at 200px the steps are short enough to read
        // as a line.
        className="h-[200px] w-full"
        margins={{ left: 0, right: 0, top: 0, bottom: 0 }}
        bloom="off"
      >
        {chart.channels.map((c) => (
          <Area key={c.key} dataKey={c.key} variant="gradient" />
        ))}
      </AreaChart>

      {/* The chart is canvas-painted, so the numbers also exist as text. */}
      <table className="sr-only">
        <caption>Signup conversion by channel</caption>
        <thead>
          <tr>
            <th scope="col">Channel</th>
            <th scope="col">Before</th>
            <th scope="col">After</th>
          </tr>
        </thead>
        <tbody>
          {chart.channels.map((c) => (
            <tr key={c.key}>
              <th scope="row">{c.label}</th>
              <td>{chart.before[c.key]}%</td>
              <td>{chart.after[c.key]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
