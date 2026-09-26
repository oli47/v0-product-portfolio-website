/** The id a section's badge gives it, for anchors: 'Problem' → 'problem'. */
export function sectionId(badge: string) {
  return badge.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
  /** Where this section sits in a short case study, drawn as a 2x2 grid that
   *  fills one square per section: `index` of `total`, 1-based. */
  step?: { index: number; total: number }
}

/** Fill order: top left, top right, bottom left, bottom right. */
function StepMark({ index, total }: { index: number; total: number }) {
  const filled = Math.round((index / total) * 4)
  return (
    // Sits on the baseline, not the caps' centre: the mark is taller than the
    // caps (12px against 8.5, NeueBit 17px caps run y 7 to 15.5 of the 24px
    // line, measured), and centred it hung below the baseline, which read as
    // the label riding high. Up 2px puts its foot within 0.5px of the baseline.
    <span aria-hidden="true" className="relative -top-[2px] grid grid-cols-2 gap-[2px] shrink-0">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="size-[5px]"
          style={{
            backgroundColor: i < filled
              ? 'var(--accent)'
              : 'color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
        />
      ))}
    </span>
  )
}

export function SectionBadge({ children, className, step }: SectionBadgeProps) {
  return (
    // A real h2, so each section is in the page outline, styled as the label.
    <h2
      className={`${step ? 'flex w-fit items-center gap-2' : 'block w-fit'} px-0 py-1.5 text-eyebrow text-[var(--color-300)] mb-6${className ? ` ${className}` : ''}`}
      style={{ borderBottom: '1px solid var(--accent)' }}
    >
      {step && <StepMark {...step} />}
      {children}
    </h2>
  )
}
