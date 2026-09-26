"use client"

import { useChartPart } from "./chart-context"

export function Grid({
  horizontal = true,
  vertical = false,
  strokeDasharray = "3 3",
  tickCount = 4,
  ticks,
}: {
  horizontal?: boolean
  /** Match the YAxis `tickCount`, so every label sits on a line. (Local patch.) */
  tickCount?: number
  /** Exact values to draw lines at, matching the YAxis `ticks`. (Local patch.) */
  ticks?: number[]
  vertical?: boolean
  strokeDasharray?: string
}) {
  const ctx = useChartPart("Grid")
  if (!ctx.ready) return null
  const { width } = ctx.plot

  return (
    <g className="stroke-border" strokeDasharray={strokeDasharray}>
      {horizontal &&
        (ticks ?? ctx.y.ticks(tickCount))
          .map((t) => (
            <line
              key={`h-${t}`}
              x1={0}
              x2={width}
              y1={ctx.y(t)}
              y2={ctx.y(t)}
            />
          ))}
      {vertical &&
        ctx.data.map((_, i) => (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable x position
            key={`v-${i}`}
            x1={ctx.xCenter(i) ?? 0}
            x2={ctx.xCenter(i) ?? 0}
            y1={0}
            y2={ctx.plot.height}
          />
        ))}
    </g>
  )
}

// Render beneath the dither canvas so grid lines sit behind the fill.
Grid.chartLayer = "back" as const
