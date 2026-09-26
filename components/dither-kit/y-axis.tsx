"use client"

import { useChartPart } from "./chart-context"

export function YAxis({
  tickFormatter,
  tickCount = 4,
  tickMargin = 8,
  ticks,
}: {
  tickFormatter?: (value: number) => string
  tickCount?: number
  tickMargin?: number
  /** Exact values to label, instead of `tickCount` nice ticks. (Local patch.) */
  ticks?: number[]
}) {
  const ctx = useChartPart("YAxis")
  if (!ctx.ready) return null

  return (
    <g className="fill-current text-eyebrow text-muted-foreground">
      {(ticks ?? ctx.y.ticks(tickCount)).map((t) => (
        <text
          key={t}
          x={-tickMargin}
          y={ctx.y(t)}
          textAnchor="end"
          dominantBaseline="central"
          fill="currentColor"
        >
          {tickFormatter ? tickFormatter(t) : t}
        </text>
      ))}
    </g>
  )
}
