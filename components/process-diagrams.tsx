'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Shared primitives ────────────────────────────────────────────────────────

export function FlowStep({ label }: { label: string }) {
  return (
    <div
      className="px-4 py-2.5 rounded-[0.125rem] border border-[var(--color-100)] text-body-2 text-[var(--color-400)] text-center"
      style={{ backgroundColor: 'var(--color-step-bg)', minWidth: '8rem' }}
    >
      {label}
    </div>
  )
}

export function FlowArrow({ id }: { id: string }) {
  return (
    <div className="flex justify-center py-3">
      <svg width="12" height="20" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <line x1="6" y1="0" x2="6" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd={`url(#${id})`} />
      </svg>
    </div>
  )
}

// ─── Before / After Flow ──────────────────────────────────────────────────────

export function BeforeAfterFlow({ before, after, caption }: { before: string[]; after: string[]; caption?: string }) {
  return (
    <div className="sm:-mx-8">
      <div className="rounded-sm border border-[var(--color-100)] overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-100)]">

          {/* BEFORE */}
          <div className="px-5 pt-5 pb-10 flex flex-col">
            <div className="mb-5">
              <span className="text-eyebrow text-[var(--color-300)] px-2 py-1 rounded-[0.125rem] border border-[var(--color-150)]" style={{ backgroundColor: 'var(--color-step-bg)' }}>
                BEFORE
              </span>
            </div>
            <div className="flex flex-col items-center">
              {before.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <FlowStep label={step} />
                  {i < before.length - 1 && <FlowArrow id={`ba-b-${i}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* AFTER */}
          <div className="p-5 flex flex-col">
            <div className="mb-5 flex sm:justify-end">
              <span className="text-eyebrow text-white px-2 py-1 rounded-[0.125rem]" style={{ backgroundColor: 'var(--accent)' }}>
                AFTER
              </span>
            </div>
            <div className="flex flex-col items-center">
              {after.map((step, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <FlowStep label={step} />
                  {i < after.length - 1 && <FlowArrow id={`ba-a-${i}`} />}
                </div>
              ))}
            </div>
          </div>

        </div>
        {caption && (
          <div className="px-5 pt-3 pb-5">
            <p className="text-body-2 text-[var(--color-300)] text-center">{caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Vertical Flow ────────────────────────────────────────────────────────────

export function VerticalFlow({ steps, arc, caption }: {
  steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]
  arc?: { fromStep: number; toStep: number; label: string }
  caption?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [arcGeo, setArcGeo] = useState<{ x: number; y1: number; y2: number; midX: number; midY: number } | null>(null)

  useEffect(() => {
    if (!arc) return
    const measure = () => {
      const container = containerRef.current
      const fromEl = stepRefs.current[arc.fromStep]
      const toEl   = stepRefs.current[arc.toStep]
      const prevEl = arc.fromStep > 0 ? stepRefs.current[arc.fromStep - 1] : null
      if (!container || !fromEl || !toEl) return
      const cr = container.getBoundingClientRect()
      const fr = fromEl.getBoundingClientRect()
      const tr = toEl.getBoundingClientRect()
      const x  = fr.right - cr.left + 12
      const y1 = prevEl
        ? (prevEl.getBoundingClientRect().bottom + fr.top) / 2 - cr.top
        : fr.top - cr.top
      const y2 = (tr.top + tr.bottom) / 2 - cr.top
      setArcGeo({ x, y1, y2, midX: x + 48, midY: (y1 + y2) / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [arc])

  return (
    <div className="sm:-mx-8">
      <div
        ref={containerRef}
        className="relative rounded-sm border border-[var(--color-100)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--color-000)' }}
      >
        <div className="flex flex-col items-center max-w-xs mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                ref={el => { stepRefs.current[i] = el }}
                className="w-full rounded-[0.125rem] border border-[var(--color-100)] overflow-hidden text-center"
                style={{ backgroundColor: 'var(--color-step-bg)' }}
              >
                <div className="px-5 pt-3">
                  <p className="text-body-1 font-bold text-[var(--color-500)] text-balance">{step.title}</p>
                </div>
                {step.subtitle && (
                  <div className="px-5 pb-3">
                    <p className="text-body-2 text-[var(--color-300)] text-pretty">{step.subtitle}</p>
                  </div>
                )}
                {step.mobileAnnotation && (
                  <div className="sm:hidden px-5 pb-3">
                    <span className="text-eyebrow text-[var(--accent)]">{step.mobileAnnotation}</span>
                  </div>
                )}
              </div>

              {i < steps.length - 1 && (
                step.labelAfter ? (
                  <div className="flex flex-col items-center py-2 gap-1">
                    <span className="text-eyebrow text-[var(--accent)]">{step.labelAfter}</span>
                    <svg width="12" height="20" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <marker id={`vf-l-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      <line x1="6" y1="0" x2="6" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd={`url(#vf-l-${i})`} />
                    </svg>
                  </div>
                ) : (
                  <FlowArrow id={`vf-${i}`} />
                )
              )}
            </div>
          ))}
        </div>

        {/* Arc annotation — desktop only */}
        {arc && arcGeo && (
          <svg
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none hidden sm:block"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <marker id="vf-arc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            <path
              d={`M ${arcGeo.x},${arcGeo.y2} C ${arcGeo.x + 64},${arcGeo.y2} ${arcGeo.x + 64},${arcGeo.y1} ${arcGeo.x},${arcGeo.y1}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              markerEnd="url(#vf-arc-arr)"
            />
          </svg>
        )}
        {arc && arcGeo && (
          <div
            aria-hidden="true"
            className="absolute hidden sm:flex items-center pointer-events-none px-1.5 py-0.5 rounded-[0.125rem]"
            style={{
              left: arcGeo.midX,
              top: arcGeo.midY,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-000)',
              fontSize: '0.625rem',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {arc.label}
          </div>
        )}
        {caption && (
          <p className="text-body-2 text-[var(--color-300)] text-center mt-6">{caption}</p>
        )}
      </div>
    </div>
  )
}

// ─── Contact Flow ─────────────────────────────────────────────────────────────

export function ContactFlowDiagram({ caption }: { caption?: string }) {
  return (
    <div className="sm:-mx-8">
      <div
        className="rounded-sm border border-[var(--color-100)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--color-000)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Card: Unidentified contact */}
          <div
            className="flex flex-col items-center gap-3 p-5 rounded-sm border border-[var(--color-100)] w-full sm:w-36 shrink-0"
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-300)]">
              <circle cx="10" cy="7" r="3.5" stroke="currentColor" />
              <path d="M3 20v-1.5C3 15.5 5.5 13.5 10 13.5H12" stroke="currentColor" />
              <circle cx="19" cy="17" r="3.5" stroke="currentColor" />
              <line x1="16.5" y1="19.5" x2="21.5" y2="14.5" stroke="currentColor" />
            </svg>
            <div className="text-center">
              <p className="text-body-2 text-[var(--color-400)] font-medium">Unidentified</p>
              <p className="text-body-2 text-[var(--color-400)] font-medium">contact</p>
            </div>
          </div>

          {/* Connector: dashed → email icon → dashed */}
          <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto gap-3">

            <div className="hidden sm:flex flex-1 min-w-0">
              <svg width="100%" height="12" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-1)"/>
              </svg>
            </div>
            <div className="flex sm:hidden">
              <svg width="12" height="30" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-v1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="6" y1="0" x2="6" y2="30" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-v1)"/>
              </svg>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="2" y="5" width="20" height="15" rx="2" fill="var(--accent)" />
                <path d="M2 9l10 6 10-6" stroke="var(--color-000)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-body-2 text-[var(--color-400)] font-medium whitespace-nowrap">Opens an email</span>
            </div>

            <div className="hidden sm:flex flex-1 min-w-0">
              <svg width="100%" height="12" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-2)"/>
              </svg>
            </div>
            <div className="flex sm:hidden">
              <svg width="12" height="30" style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                  <marker id="cf-arr-v2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0 0.5 L5 3 L0 5.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                <line x1="6" y1="0" x2="6" y2="30" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" markerEnd="url(#cf-arr-v2)"/>
              </svg>
            </div>

          </div>

          {/* Card: Identified contact */}
          <div
            className="flex flex-col items-center gap-3 p-5 rounded-sm border border-[var(--color-100)] w-full sm:w-36 shrink-0"
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="7" r="3.5" stroke="var(--accent-green)" />
              <path d="M3 20v-1.5C3 15.5 5.5 13.5 10 13.5H12" stroke="var(--accent-green)" />
              <path d="M15 17l2 2 4.5-4.5" stroke="var(--accent-green)" />
            </svg>
            <div className="text-center">
              <p className="text-body-2 text-[var(--color-400)] font-medium">Sarah Miller</p>
              <p className="text-body-2 text-[var(--color-300)]">miller@email.com</p>
            </div>
          </div>

        </div>
        {caption && (
          <p className="text-body-2 text-[var(--color-300)] text-center mt-6">
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
