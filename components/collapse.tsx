'use client'

import { useId, useState } from 'react'

/**
 * A closed, accent-tinted box for the part of a case study a reader can skip:
 * the background. The page reads Problem, Solution, Outcome without it; anyone
 * who wants the rest opens it. Not <details>: its content cannot animate open,
 * and this one slides, a grid row easing from 0fr to 1fr.
 */
export function Collapse({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div
      id={id}
      className="rounded-sm"
      style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 cursor-pointer px-6 py-4 sm:px-8 text-left"
      >
        {/* The accent pulled 15% toward the text colour: on the tinted box
            the pure accent measured 4.37:1 light and 4.15:1 dark, under AA's
            4.5 for text this size. This reads 5.37 and 4.83. */}
        <span className="text-eyebrow" style={{ color: 'color-mix(in srgb, var(--accent) 85%, var(--color-500))' }}>{label}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
          className={`shrink-0 text-[var(--accent)] transition-transform duration-[400ms] ease-in-out ${open ? 'rotate-45' : ''}`}
          style={{ stroke: 'currentColor' }}
        >
          <path d="M6 0v12M0 6h12" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-[400ms] ease-in-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        // React 18 has no boolean `inert`: an empty string sets it, leaving
        // it off clears it. Closed, the panel's links are out of the tab order.
        {...(open ? {} : { inert: '' as unknown as boolean })}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
