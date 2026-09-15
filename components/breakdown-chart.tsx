'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { Area } from '@/components/dither-kit/area'
import { AreaChart } from '@/components/dither-kit/area-chart'
import { Grid } from '@/components/dither-kit/grid'
import { Tooltip } from '@/components/dither-kit/tooltip'
import { PALETTE, rgb } from '@/components/dither-kit/palette'
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
}

/**
 * The Impact section's channel split, as one stacked area under two points
 * (Before, After) instead of flat number cards beside the north star. The
 * curve's height at each point is its channels' rates turned into their
 * share of the combined total, so the rise from "Before" to "After" *is*
 * the published north star (+200%): `channels[].share` is picked so the
 * blend lands on that independently-measured total, which is a looser fit
 * than the "about 85%" desktop split the prose beside it states — the
 * north star here is a fact in its own right, not something derived from
 * the per-channel numbers. The stack order puts the smaller,
 * faster-growing channel at the base and the larger one on top of it, so
 * mobile going from invisible to a real band reads as exactly that — the
 * opposite of the *listed*
 * order below, which keeps desktop first since that is still the bigger,
 * more familiar number to read first.
 *
 * The tooltip un-does the weighting: it always shows "after"'s own rate and
 * growth per channel — the numbers a reader actually recognises, not the
 * abstract contribution the curve's height plots, and not a tooltip that
 * reshapes into a bare "before" reading depending on where the cursor lands.
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

  // `config`'s own key order drives the stack (first key = base layer) *and*
  // the tooltip's/legend's natural row order — the same order doing two
  // different jobs that want different answers here, so the two are split:
  // this key order is stacking order only (mobile first → mobile at the
  // base), and `listOrder`/the manual legend below fix the *display* order
  // back to desktop-first independently.
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

  const listOrder = useMemo(() => chart.channels.map((c) => c.key), [chart])

  const shareOf = useMemo(
    () => Object.fromEntries(chart.channels.map((c) => [c.key, c.share])),
    [chart]
  )

  return (
    <figure>
      <AreaChart
        data={data}
        config={config}
        stackType="stacked"
        className="h-[200px] w-full"
        margins={{ left: 6, right: 6, top: 10, bottom: 6 }}
        bloom="off"
      >
        {/* `Grid` paints on the "back" SVG layer, behind the canvas fill —
            no axis text, so no margin space to reserve for it. Purely
            decorative reference lines, not a scale to read. */}
        <Grid horizontal vertical={false} />
        {chart.channels.map((c) => (
          <Area key={c.key} dataKey={c.key} variant="gradient" />
        ))}
        {/* Reads back each channel's own rate (value ÷ its traffic share)
            and its own growth — the numbers a reader actually recognises,
            not the abstract contribution the curve's height plots.
            `forceIndex={1}` ("after") and `order`: one tooltip, always the
            same shape and the same story, rather than one that reshapes
            into a bare "before" reading depending on where the cursor
            lands, or lists mobile above desktop because that's what the
            stack order happens to be. */}
        <Tooltip
          labelKey="label"
          forceIndex={1}
          order={listOrder}
          valueFormatter={(value, name) => {
            const share = shareOf[name] ?? 1
            const rate = Math.round((value / share) * 100) / 100
            const before = chart.before[name]
            // Guards a 0% "before" rate: growth off a zero baseline is
            // undefined, not a number this can round to a sign and a "%".
            const growth = before
              ? Math.round(((chart.after[name] - before) / before) * 100)
              : null
            return (
              <>
                {growth != null && (
                  <span className="text-muted-foreground">({growth > 0 ? '+' : ''}{growth}%) </span>
                )}
                {rate}%
              </>
            )
          }}
        />
      </AreaChart>

      {/* In-flow, desktop-first — not `<BlockLegend>`, which would iterate
          `config`'s own (reversed, stacking) key order. No axis labels tell
          the curve's two points apart anymore (the tooltip's heading does
          that on hover), so this is the one thing that's always on: which
          colour is which channel. */}
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 px-1">
        {chart.channels.map((c) => (
          <li key={c.key} className="flex items-center gap-1.5 text-eyebrow text-muted-foreground">
            <span
              className="size-2 rounded-[1px]"
              style={{ backgroundColor: rgb(PALETTE[config[c.key].color].fill) }}
            />
            <span>{c.label}</span>
          </li>
        ))}
      </ul>

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
