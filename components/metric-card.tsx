import type { ReactNode } from 'react'
import { Bold } from '@/components/bold'
import { BreakdownAreaChart, type BreakdownChart } from '@/components/breakdown-chart'
import { FRAME_PAD } from '@/components/process-blocks'

// MetricMain — h1-size value, body-1 note pinned to bottom, always accent.
// `children` sits between the value and the note: a chart there belongs to the
// number above it rather than reading as a second, unrelated block.
export function MetricMain({ label, value, note, className, children }: {
  label: string; value: string; note?: string; className?: string; children?: ReactNode
}) {
  return (
    <div className={`${FRAME_PAD} rounded-sm flex flex-col h-full ${className ?? ''}`} style={{ backgroundColor: 'var(--color-000)' }}>
      <div className="flex flex-col gap-3">
        <div className="text-eyebrow text-[var(--color-300)]">{label}</div>
        <div className="font-display leading-none text-[var(--accent)]"
          style={{ fontSize: 'clamp(2.875rem, 8vw, 3.5rem)' }}>
          {value}
        </div>
      </div>
      {children}
      {note && <p className="text-body-2 text-[var(--color-500)] text-pretty mt-auto pt-6"><Bold text={note} /></p>}
    </div>
  )
}

/**
 * The Impact section's own composite: the story in prose on the left, the
 * north-star number on the right with a stacked bar chart under it (e.g.
 * desktop vs mobile, before vs after) — one card, not a paragraph followed
 * by a stack of `MetricMain`s. `page.tsx` only reaches for this when a
 * project actually has a `breakdownChart` to show; every other project keeps
 * the stacked cards.
 */
export function ImpactSummaryCard({ summary, note, northStar, breakdownChart }: {
  summary?: string
  note?: string
  northStar: { label: string; value: string }
  breakdownChart: BreakdownChart
}) {
  return (
    <div className={`${FRAME_PAD} rounded-sm`} style={{ backgroundColor: 'var(--color-000)' }}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 items-start">
        <div className="flex flex-col gap-4">
          {summary && <p className="text-body-2 text-[var(--color-500)] text-pretty"><Bold text={summary} /></p>}
          {note && <p className="text-body-2 text-[var(--color-500)] text-pretty"><Bold text={note} /></p>}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="text-eyebrow text-[var(--color-300)]">{northStar.label}</div>
            <div className="font-display leading-none text-[var(--accent)]"
              style={{ fontSize: 'clamp(2.875rem, 8vw, 3.5rem)' }}>
              {northStar.value}
            </div>
          </div>
          <BreakdownAreaChart chart={breakdownChart} />
        </div>
      </div>
    </div>
  )
}
