'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCursorFollow } from '@/components/cursor-follow'
import { DEMOS } from '@/components/demos/registry'
import { ScrambleText } from '@/components/scramble-text'
import { content, defaultLang } from '@/lib/content'
import type { Project } from '@/lib/projects'

const t = content[defaultLang].projects

// ─── Active project row ──────────────────────────────────────────────────────

export function ProjectRow({ project }: { project: Project }) {
  const { areaRef, followRef, handlers } = useCursorFollow<HTMLAnchorElement, HTMLDivElement>()
  const [hovered, setHovered] = useState(false)
  const Demo = project.demo ? DEMOS[project.demo] : null

  return (
    <Link
      ref={areaRef}
      onMouseEnter={(e) => { handlers.onMouseEnter(e); setHovered(true) }}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={() => { handlers.onMouseLeave(); setHovered(false) }}
      href={`/projects/${project.slug}`}
      aria-label={`View case study: ${project.title}`}
      className="group relative block"
    >
      {/* Thumbnail — full-bleed on mobile, inset on a card fill on desktop.
          Where the project has a coded demo it takes the same slot, still at
          rest and playing while the row is hovered. */}
      <div className="flex w-full items-end justify-center overflow-hidden rounded-[0.125rem] bg-[var(--color-000)] aspect-[378/235] sm:aspect-[680/320] transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]">
        {Demo ? (
          // Sized by height, not width. Every demo shows the same screen here
          // that the case study shows, and those screens are not all the same
          // shape — measuring from the slot's height is what lets each one sit
          // in it identically instead of each needing its own width. It keeps
          // the beige margin the covers have (12% of the slot on a phone, 5%
          // above sm), sits flush with the bottom the way they do, and
          // `demo-lift` scales it up from that edge while the row is hovered
          // (see globals.css).
          <div className="demo-lift h-[88%] sm:h-[95%]" data-lift={hovered}>
            <Demo variant="card" fit="height" play={hovered} />
          </div>
        ) : (
          <Image
            src={project.thumbnailImage}
            alt=""
            width={680}
            height={423}
            quality={95}
            sizes="(max-width: 640px) 100vw, 514px"
            className="h-full w-full object-cover sm:w-[75.6%]"
          />
        )}
      </div>

      {/* Hover CTA — trails the pointer across the whole card; desktop only,
          decorative (the card itself is the link) */}
      <div
        ref={followRef}
        aria-hidden="true"
        style={{ willChange: 'transform' }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden items-center gap-2 rounded-[0.125rem] bg-[var(--accent)] px-3 py-2 opacity-0 shadow-[0_4px_20px_8px_rgba(0,0,0,0.16)] transition-opacity duration-[400ms] ease-in-out group-hover:opacity-100 sm:flex"
      >
        <span className="text-eyebrow whitespace-nowrap text-[var(--background)]">
          {t.viewCaseStudy}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--background)]">
          <path
            d="M10.6667 8.66667V7.33333H9.33333V8.66667H10.6667ZM9.33333 7.33333V6H8V7.33333H9.33333ZM9.33333 10V8.66667H8V10H9.33333ZM8 6V4.66667H6.66667V6H8ZM8 11.3333V10H6.66667V11.3333H8ZM6.66667 4.66667V3.33333H5.33333V4.66667H6.66667ZM6.66667 12.6667V11.3333H5.33333V12.6667H6.66667Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Title + description, metrics chip — chip sits above the title on mobile */}
      <div className="flex flex-col-reverse gap-3 py-3 sm:flex-row sm:items-start sm:gap-10 sm:py-4">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-1">
          <h3 className="text-h4 text-[var(--color-400)] text-pretty">
            <ScrambleText text={project.title} active={hovered} />
          </h3>
          <p className="text-body-2 text-[var(--color-300)] text-pretty">
            <ScrambleText text={project.description} active={hovered} />
          </p>
        </div>

        {project.metrics.length > 0 && (
          <div className="flex shrink-0 flex-wrap gap-2 self-start">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-[0.125rem] bg-[var(--color-000)] px-2 py-0.5"
              >
                <span
                  className="text-eyebrow whitespace-nowrap"
                  style={{
                    color: metric.color === 'accent' ? 'var(--accent)' : 'var(--color-400)',
                  }}
                >
                  <ScrambleText text={metric.value} active={hovered} />
                </span>
                <span className="text-eyebrow whitespace-nowrap text-[var(--color-300)]">
                  <ScrambleText text={metric.label} active={hovered} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
