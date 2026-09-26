import type { ReactNode } from 'react'
import { Bold } from '@/components/bold'
import { BreakdownAreaChart, type BreakdownChart } from '@/components/breakdown-chart'
import { FRAME_PAD } from '@/components/process-blocks'

/** `after` over `before`, as the signed percent the cards print. */
function growth(before: number, after: number) {
  const g = Math.round(((after - before) / before) * 100)
  return `${g > 0 ? '+' : ''}${g}%`
}

/** What sits beside a number on a green tint: its before and after, or any
 *  short fact that backs it ("860 of 902"). */
function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-[0.125rem] px-1.5 py-0.5 text-[var(--color-500)] whitespace-nowrap"
      style={{
        fontSize: '0.8125rem',
        lineHeight: '1.25rem',
        backgroundColor: 'color-mix(in srgb, var(--accent-green) 14%, var(--background))',
      }}
    >
      {children}
    </span>
  )
}

export type OutcomeColumn = { label: string; value: string; badge?: string }

/**
 * The Outcome section on a compact case study: the story in a short paragraph,
 * then one card. The card leads with the headline number and its badge, an
 * optional chart right under it, then the supporting numbers in columns split
 * by a rule. Without a headline the columns are the card, as equals, at the
 * headline's size.
 */
export function OutcomeCard({ summary, label, value, badge, chart, columns }: {
  summary?: string
  label?: string
  value?: string
  badge?: string
  /** Drawn right under the headline number, the chart it sums up. */
  chart?: ReactNode
  columns: OutcomeColumn[]
}) {
  return (
    <div className="flex flex-col gap-10">
      {summary && (
        <p className="text-body-2 text-[var(--color-500)] text-pretty"><Bold text={summary} /></p>
      )}
      <div className={`${FRAME_PAD} rounded-sm flex flex-col gap-8`} style={{ backgroundColor: 'var(--color-000)' }}>
        {/* The number and the chart it sums up, no gap between them. */}
        {label && value && (
          <div className="flex flex-col">
            <div className="flex flex-col gap-3">
              <div className="text-eyebrow text-[var(--color-300)]">{label}</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-display leading-none text-[var(--accent)]" style={{ fontSize: 'clamp(2.875rem, 8vw, 3.5rem)' }}>
                  {value}
                </span>
                {badge && <Badge>{badge}</Badge>}
              </div>
            </div>
            {chart}
          </div>
        )}
        {columns.length > 0 && (
          <div className={`grid gap-y-6 ${columns.length > 2 ? 'sm:grid-cols-3' : columns.length > 1 ? 'grid-cols-2' : ''}`}>
            {columns.map((c, i) => (
              <div
                key={c.label}
                className={`flex flex-col gap-3 ${
                  columns.length > 2
                    ? `${i > 0 ? 'sm:border-l sm:border-[var(--border)] sm:pl-6' : ''} ${i < columns.length - 1 ? 'sm:pr-6' : ''}`
                    : i > 0 ? 'border-l border-[var(--border)] pl-4 sm:pl-6' : 'pr-4 sm:pr-6'
                }`}
              >
                <div className="text-eyebrow text-[var(--color-300)]">{c.label}</div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                  <span className="font-display leading-none text-[var(--accent)]" style={{ fontSize: label ? '1.75rem' : 'clamp(2.875rem, 8vw, 3.5rem)' }}>
                    {c.value}
                  </span>
                  {c.badge && <Badge>{c.badge}</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Signup's card: the total's own before and after on the headline, each
 *  channel's growth and rates in the columns. */
export function ImpactSummaryCard({ summary, northStar, breakdownChart }: {
  summary?: string
  northStar: { label: string; value: string }
  breakdownChart: BreakdownChart
}) {
  const { total, channels, before, after } = breakdownChart
  return (
    <OutcomeCard
      summary={summary}
      label={northStar.label}
      value={northStar.value}
      badge={`${total.before}% → ${total.after}%`}
      chart={<BreakdownAreaChart chart={breakdownChart} />}
      columns={channels.map((c) => ({
        label: c.label,
        value: growth(before[c.key], after[c.key]),
        badge: `${before[c.key]}% → ${after[c.key]}%`,
      }))}
    />
  )
}
