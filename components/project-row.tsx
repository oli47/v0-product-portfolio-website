'use client'

import Link from 'next/link'
import { useScramble } from '@/lib/use-scramble'
import { content, defaultLang } from '@/lib/content'
import type { Project } from '@/lib/projects'

const t = content[defaultLang].projects

// ─── Active project row ──────────────────────────────────────────────────────

export function ProjectRow({
  project,
  isLast = false,
}: {
  project: Project
  isLast?: boolean
}) {
  const discover = useScramble(t.discover)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block"
      onMouseEnter={discover.scramble}
      onMouseLeave={discover.reset}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-end sm:justify-between p-4 sm:p-6 gap-4 sm:gap-10 transition-colors duration-[320ms] ease-linear ease-linear group-hover:bg-[#EDE7D9] dark:group-hover:bg-[var(--color-000)] ${!isLast ? 'border-b border-[var(--color-100)]' : ''}`}
      >
        {/* Content — title + description + metrics */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-2">
            <h3 className="text-h4 text-[var(--color-400)] transition-colors duration-[320ms] ease-linear group-hover:text-[var(--accent)] text-pretty">
              {project.title}
            </h3>
            <p className="text-body-2 text-[var(--color-300)] transition-colors duration-[320ms] ease-linear group-hover:text-[var(--color-400)] text-pretty">
              {project.description}
            </p>
          </div>

          {project.metrics.length > 0 && (
            <div className="flex items-center justify-between sm:block">
              <div className="flex flex-wrap gap-6 py-2">
                {project.metrics.slice(0, 2).map((metric, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="text-eyebrow"
                      style={{
                        color: metric.color === 'accent' ? 'var(--accent)' : 'var(--color-400)',
                      }}
                    >
                      {metric.value}
                    </span>
                    <span className="text-eyebrow text-[var(--color-300)]">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Arrow button — mobile only, no "Discover" text */}
              <div className="sm:hidden relative flex items-center justify-center w-10 h-10 rounded-[0.125rem] overflow-hidden border border-[var(--color-150)] group-hover:border-[var(--accent)] transition-colors duration-[320ms] ease-linear shrink-0">
                <div
                  className="absolute inset-0 bg-[var(--accent)] origin-left scale-x-0 group-hover:scale-x-100"
                  style={{ transition: 'transform 320ms linear' }}
                />
                <span className="font-neubit text-[1.25rem] leading-[1] relative z-10 text-[var(--color-300)] group-hover:text-[#FAF7F2] transition-colors duration-[320ms] ease-linear inline-block">
                  →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Discover — hidden on mobile (whole card is tappable anyway) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span
            ref={discover.spanRef}
            className="text-eyebrow text-[var(--color-300)] transition-colors duration-[320ms] ease-linear group-hover:text-[var(--accent)]"
          >
            {t.discover}
          </span>

          {/* Square button — orange fill sweeps left→right */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-[0.125rem] overflow-hidden border border-[var(--color-150)] group-hover:border-[var(--accent)] transition-colors duration-[320ms] ease-linear">
            <div
              className="absolute inset-0 bg-[var(--accent)] origin-left scale-x-0 group-hover:scale-x-100"
              style={{ transition: 'transform 320ms linear' }}
            />
            <span className="font-neubit text-[1.25rem] leading-[1] relative z-10 text-[var(--color-300)] group-hover:text-[#FAF7F2] transition-colors duration-[320ms] ease-linear inline-block">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Soon (disabled) row ─────────────────────────────────────────────────────

export function ProjectRowSoon({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-end justify-between p-6 gap-10">
      <div className="flex flex-col gap-2 min-w-0 opacity-50">
        <h3 className="text-h4 text-[var(--color-400)] text-pretty">{title}</h3>
        <p className="text-body-2 text-[var(--color-300)] text-pretty">{description}</p>
      </div>
      <div className="shrink-0 px-2 py-1 bg-[var(--color-000)] rounded-[0.125rem] opacity-50">
        <span className="text-eyebrow text-[var(--color-300)]">
          {t.soon}
        </span>
      </div>
    </div>
  )
}
