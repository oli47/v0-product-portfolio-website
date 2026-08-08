'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { BarChart } from '@/components/dither-kit/bar-chart'
import { Bar } from '@/components/dither-kit/bar'
import { XAxis } from '@/components/dither-kit/x-axis'
import { YAxis } from '@/components/dither-kit/y-axis'
import { Grid } from '@/components/dither-kit/grid'
import { Tooltip } from '@/components/dither-kit/tooltip'
import { PALETTE, type Rgb } from '@/components/dither-kit/palette'

export type CohortPoint = { label: string; full: string; value: number }

/** dither-kit resolves a series colour through a static PALETTE keyed by name,
 *  so the only way to make it follow the site's `--accent` (which flips between
 *  themes) is to rewrite the seed and hand the chart a fresh `config` object —
 *  the chart memoises its colour lookup on `config` identity. */
const hexToRgb = (hex: string): Rgb | null => {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const mix = ([r, g, b]: Rgb, amount: number): Rgb => [
  Math.round(r + (255 - r) * amount),
  Math.round(g + (255 - g) * amount),
  Math.round(b + (255 - b) * amount),
]

export function CohortChart({
  data,
  seriesLabel,
}: {
  data: CohortPoint[]
  seriesLabel: string
}) {
  const { resolvedTheme } = useTheme()
  const [seedTick, setSeedTick] = useState(0)

  useEffect(() => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
    const fill = hexToRgb(accent)
    if (!fill) return
    PALETTE.orange = { fill, line: mix(fill, 0.45), star: mix(fill, 0.7) }
    setSeedTick((t) => t + 1)
  }, [resolvedTheme])

  const config = useMemo(
    () => ({ value: { label: seriesLabel, color: 'orange' as const } }),
    // seedTick is the dep that forces the colour lookup to re-run after the
    // seed is rewritten above.
    [seriesLabel, seedTick]
  )

  return (
    <figure className="mt-6">
      <BarChart
        data={data}
        config={config}
        className="h-[200px] w-full"
        margins={{ left: 34, right: 6, top: 10, bottom: 22 }}
        bloom="off"
      >
        <Grid />
        <YAxis tickCount={3} tickFormatter={(v) => `${v}%`} />
        <XAxis dataKey="label" maxTicks={11} />
        <Bar dataKey="value" variant="gradient" />
        {/* `full` rather than `label`: the axis tick has to stay short, but the
            tooltip is the place that explains, so it spells the month out. */}
        <Tooltip labelKey="full" valueFormatter={(v) => `${v}%`} />
      </BarChart>

      {/* The chart is canvas-painted, so the numbers also exist as text. */}
      <table className="sr-only">
        <caption>{seriesLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Cohort</th>
            <th scope="col">{seriesLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.full}</th>
              <td>{d.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
