'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Shared primitives ────────────────────────────────────────────────────────

function FlowArrow({ id }: { id: string }) {
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
            className="absolute hidden sm:flex items-center pointer-events-none px-1.5 py-0.5 rounded-[0.125rem] text-eyebrow text-[var(--accent)] whitespace-nowrap"
            style={{
              left: arcGeo.midX,
              top: arcGeo.midY,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-000)',
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

/** The mail in flight. */
const EnvelopeGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="block">
    <rect x="2" y="5" width="20" height="15" rx="2" fill="var(--accent)" />
    <path d="M2 9l10 6 10-6" stroke="var(--color-000)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/** The same mail once it has been opened: flap thrown back, letter half out.
    It sits on the panel's own background, which masks the end of the dashed
    line behind its open flap. */
const OpenEnvelopeGlyph = () => (
  <span
    className="block rounded-full p-1"
    style={{ backgroundColor: 'var(--color-000)' }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="block">
      <path d="M2.75 10.5L12 3.5l9.25 7" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="6.5" y="7" width="11" height="8" rx="1" fill="var(--color-000)" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M2 10.5l10 6 10-6V20a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 20v-9.5z" fill="var(--accent)" />
    </svg>
  </span>
)

/** Both halves of a two-state cell sit in the same grid slot, so the box takes
    the height of the taller one and neither state can shift the layout as it
    hands over. */
const CELL = 'col-start-1 row-start-1'

/** Where the mail comes to rest: the track's far end, less half the width of
    the opened mail's mask, so the mask clears the card it is delivering to.
    The distance itself is `--cf-mail-inset`, declared on `.cf-diagram` in
    globals.css, because four things have to agree on it — where the line stops,
    where the travelling mail stops, where the opened one parks, and the same on
    the vertical track — and three of them are keyframes. */
const MAIL_REST = 'calc(100% - var(--cf-mail-inset))'
const LINE_END = 'var(--cf-mail-inset)'

/** Both boxes, one width. 11rem rather than the 9rem they started at because
    `miller@email.com` measures 115px and cannot break: at 9rem the widest state
    was 155px inside a 142px content box, so the grid cell overhung the card's
    right border and pushed the content of BOTH states off its centre. */
const CARD_W = 'w-full sm:w-44'

/**
 * edrone sends a mail → the contact opens it → the contact stops being anonymous.
 *
 * The section spends four paragraphs on the fact that identification only
 * happens when a contact acts first, and that is three beats, not one: the send
 * and the open are different events by different actors, and the cookie only
 * exists because of the second. So the diagram plays them one at a time — the
 * mail crosses, the mail opens where it landed, and only then does the card turn
 * from a crossed-out silhouette into a name. Two actors, never three boxes: the
 * anonymous visitor and Sarah Miller are the same person, so they are the same
 * card. Same beats on both axes, since the flow turns the corner on a phone.
 */
export function ContactFlowDiagram({ caption }: { caption?: string }) {
  return (
    <div className="sm:-mx-8">
      <div
        className="cf-diagram rounded-sm border border-[var(--color-100)] p-6 sm:p-10"
        style={{ backgroundColor: 'var(--color-000)' }}
      >
        <div className="cf-row flex flex-col items-stretch sm:flex-row justify-between gap-3">

          {/* Sender: edrone */}
          <div
            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-sm border border-[var(--color-100)] shrink-0 ${CARD_W}`}
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]" aria-hidden>
              <path d="M21 3L2 10.5l7 3M21 3l-3 17-9-6.5M21 3L9 13.5v5.5l3-3" stroke="currentColor" />
            </svg>
            <p className="text-body-2 text-[var(--color-400)] font-medium">edrone</p>
          </div>

          {/* The track, and the mail crossing it. On a wide screen the track is
              the only thing here that takes part in the row's centring, so the
              line meets the cards at their middle; the running caption hangs
              below it, out of the layout. In a column there is nothing to line
              up with, so it goes back in the flow. */}
          <div className="relative flex w-full flex-1 flex-col items-center gap-2 sm:w-auto sm:self-center">

            {/* Horizontal track, desktop */}
            <div className="relative hidden h-6 w-full sm:block">
              {/* The line ends exactly where the mail comes to rest, so the
                  dashes run into it rather than out from under it. */}
              <div className="absolute left-0 top-1/2 h-3 -translate-y-1/2" style={{ right: LINE_END }}>
                <svg width="100%" height="12" style={{ display: 'block' }} aria-hidden>
                  <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" className="cf-dash"/>
                </svg>
              </div>
              {/* Two elements so the travel is a transform and nothing in this
                  animation touches layout: the outer one spans the track, so a
                  percentage translate measures the track rather than the 24px
                  glyph, and the inner one carries the centring and the pop. */}
              <span className="cf-travel-x absolute inset-x-0 top-1/2 block">
                <span className="cf-mail absolute left-0 top-0 block">
                  <EnvelopeGlyph />
                </span>
              </span>
              <span className="cf-open absolute top-1/2" style={{ left: MAIL_REST }}>
                <OpenEnvelopeGlyph />
              </span>
            </div>

            {/* Vertical track, phone */}
            <div className="relative h-20 w-6 sm:hidden">
              <div className="absolute left-1/2 top-0 w-3 -translate-x-1/2" style={{ bottom: LINE_END }}>
                <svg width="12" height="100%" style={{ display: 'block' }} aria-hidden>
                  <line x1="6" y1="0" x2="6" y2="100%" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" className="cf-dash"/>
                </svg>
              </div>
              <span className="cf-travel-y absolute inset-y-0 left-1/2 block">
                <span className="cf-mail absolute left-0 top-0 block">
                  <EnvelopeGlyph />
                </span>
              </span>
              <span className="cf-open absolute left-1/2" style={{ top: MAIL_REST }}>
                <OpenEnvelopeGlyph />
              </span>
            </div>

            {/* One line, three beats — who acted, and what it left behind. */}
            <span className="grid justify-items-center whitespace-nowrap sm:absolute sm:left-1/2 sm:top-full sm:mt-2 sm:-translate-x-1/2">
              <span className={`${CELL} cf-say-1 text-body-2 text-[var(--color-400)] font-medium`}>
                Sends an email
              </span>
              <span className={`${CELL} cf-say-2 text-body-2 text-[var(--color-400)] font-medium`}>
                Contact opens it
              </span>
              <span className={`${CELL} cf-say-3 text-body-2 text-[var(--color-400)] font-medium`}>
                Cookie set
              </span>
            </span>
          </div>

          {/* One contact, two states. Not two cards: the point is that the
              anonymous visitor and the named one are the same person. */}
          <div
            className={`cf-resolve grid shrink-0 rounded-sm border border-[var(--color-100)] ${CARD_W}`}
            style={{ backgroundColor: 'var(--color-step-bg)' }}
          >
            {/* Before */}
            <div className={`${CELL} cf-state-a flex flex-col items-center justify-center gap-3 p-5`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-300)]" aria-hidden>
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" />
                <path d="M3 20v-1.5C3 15.5 5.5 13.5 10 13.5H12" stroke="currentColor" />
                <circle cx="19" cy="17" r="3.5" stroke="currentColor" />
                <line x1="16.5" y1="19.5" x2="21.5" y2="14.5" stroke="currentColor" />
              </svg>
              <div className="text-center">
                <p className="text-body-2 text-[var(--color-400)] font-medium">Unidentified</p>
                <p className="text-body-2 text-[var(--color-300)]">no cookie yet</p>
              </div>
            </div>

            {/* Only ever seen when the states are un-stacked, which is to say
                under reduced motion: with both of them on screen at once,
                something has to say which way round they go. */}
            <div className={`${CELL} cf-then justify-center`} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--color-300)]">
                <path d="M8 2v12M3.5 9.5 8 14l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* After */}
            <div className={`${CELL} cf-state-b flex flex-col items-center justify-center gap-3 p-5`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
