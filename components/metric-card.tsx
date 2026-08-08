import type { ReactNode } from 'react'
import { Bold } from '@/components/bold'

// MetricMain — h1-size value, body-1 note pinned to bottom, always accent.
// `children` sits between the value and the note: a chart there belongs to the
// number above it rather than reading as a second, unrelated block.
export function MetricMain({ label, value, note, className, children }: {
  label: string; value: string; note?: string; className?: string; children?: ReactNode
}) {
  return (
    <div className={`p-5 rounded-sm flex flex-col h-full ${className ?? ''}`} style={{ backgroundColor: 'var(--color-000)' }}>
      <div className="flex flex-col gap-3">
        <div className="text-eyebrow text-[var(--color-300)]">{label}</div>
        <div className="font-display leading-none text-[var(--accent)]"
          style={{ fontSize: 'clamp(2.875rem, 8vw, 3.5rem)' }}>
          {value}
        </div>
      </div>
      {children}
      {note && <p className="text-body-1 text-[var(--color-500)] text-pretty mt-auto pt-6"><Bold text={note} /></p>}
    </div>
  )
}
