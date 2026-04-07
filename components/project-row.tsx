'use client'

import Link from 'next/link'
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
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div
        className={`flex items-end justify-between p-6 gap-10 transition-colors duration-[320ms] group-hover:bg-[var(--color-000)] ${!isLast ? 'border-b border-[var(--color-100)]' : ''}`}
      >
        {/* Left — title + description + metrics */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-2">
            <h3 className="text-h4 text-[var(--color-400)] transition-colors duration-[320ms] group-hover:text-[var(--accent)] text-pretty">
              {project.title}
            </h3>
            <p className="text-body-2 text-[var(--color-300)] transition-colors duration-[320ms] group-hover:text-[var(--color-400)] text-pretty">
              {project.description}
            </p>
          </div>

          {project.metrics.length > 0 && (
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
          )}
        </div>

        {/* Right — discover button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-eyebrow text-[var(--color-300)] transition-colors duration-[320ms] group-hover:text-[var(--accent)]">
            {t.discover}
          </span>
          <div className="flex items-center justify-center w-10 h-10 border border-[var(--color-150)] rounded-[0.125rem] overflow-hidden transition-colors duration-[320ms] group-hover:bg-[var(--color-100)] group-hover:border-[var(--color-100)]">
            <span className="font-neubit text-[1.25rem] leading-[1] text-[var(--color-300)] transition-all duration-[320ms] group-hover:text-[var(--accent)] group-hover:translate-x-[3px] inline-block">
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
