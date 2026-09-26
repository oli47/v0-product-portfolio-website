'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import { AreaChart } from '@/components/dither-kit/area-chart'
import { Area } from '@/components/dither-kit/area'
import { XAxis } from '@/components/dither-kit/x-axis'
import { YAxis } from '@/components/dither-kit/y-axis'
import { Grid } from '@/components/dither-kit/grid'
import { Tooltip } from '@/components/dither-kit/tooltip'
import { PALETTE } from '@/components/dither-kit/palette'
import { hexToRgb, mix } from '@/components/dither-kit/site-colors'

export type CohortPoint = { label: string; full: string; value: number }

/** A metric's monthly cohorts as one dithered area, for a trend across many
 *  points where each point on its own matters less than the line. */
export function CohortChart({ data, seriesLabel }: { data: CohortPoint[]; seriesLabel: string }) {
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
      <AreaChart
        data={data}
        config={config}
        className="h-[200px] w-full"
        margins={{ left: 40, right: 12, top: 10, bottom: 24 }}
        bloom="off"
      >
        <Grid ticks={[40, 80]} />
        {/* 40% and 80%, the top of the range, and no 0%: the 0% tick sat on
            top of the first month's label in the corner the two axes share. */}
        <YAxis ticks={[40, 80]} tickFormatter={(v) => `${v}%`} />
        <XAxis dataKey="label" maxTicks={4} />
        <Area dataKey="value" variant="gradient" />
        {/* `full` rather than `label`: the axis tick has to stay short, but the
            tooltip is the place that explains, so it spells the month out. */}
        <Tooltip labelKey="full" valueFormatter={(v) => `${v}%`} />
      </AreaChart>

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
