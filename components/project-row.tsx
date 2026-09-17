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
  const { areaRef, followRef, handlers } = useCursorFollow<HTMLAnchorElement, HTMLDivElement>(20, -32)
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
      <div className="flex w-full items-center justify-center overflow-hidden rounded-[0.125rem] bg-[var(--color-000)] aspect-[378/236] sm:items-end sm:aspect-[680/400] transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]">
        {Demo ? (
          // Every demo shows the same screen here that the case study shows,
          // and those screens are not all the same shape, so the slot measures
          // from whichever side binds: its width on a phone, its height above
          // sm. Each one then lands on the same margin rather than needing its
          // own number, and `demo-lift` scales it up while the row is hovered
          // (see globals.css).
          //
          // The phone numbers are solved rather than picked. A 1.6 slot is far
          // taller than any of the three stages, so filling its width left a
          // 60px band of beige above a screen with 32px beside it — even, but
          // lopsided, and the screen small for it. Shortening the slot to 1.68
          // and taking 91% of its width puts a 16px frame on all four sides of
          // all three, and buys the screens back about a ninth of their width.
          //
          // Height binds above sm (see DemoFrame's `fit="card"` doc), so every
          // demo here sits at the same fraction of the slot's height regardless
          // of its own shape — and `items-end` dumps all the slack above it,
          // not split top and bottom. At 76% that was a measured 75.7px band of
          // beige above every demo (536x315 slot). Raised to 88% to roughly
          // halve it, to ~38px, without changing the slot's own footprint.
          <div className="demo-lift w-[91%] sm:h-[88%] sm:w-auto" data-lift={hovered}>
            <Demo variant="card" fit="card" play={hovered} />
          </div>
        ) : (
          <div className="demo-lift h-full w-full sm:h-auto sm:w-[82.5%]" data-lift={hovered}>
            <Image
              src={project.thumbnailImage}
              alt=""
              width={680}
              height={423}
              quality={95}
              sizes="(max-width: 640px) 100vw, 514px"
              className="h-full w-full object-cover sm:h-auto sm:w-full sm:object-contain"
            />
          </div>
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

      {/* The card is a single sentence: the scramble lead runs into the accent
          metric phrase, kept in the same font as the rest. */}
      <div className="flex flex-col-reverse gap-3 py-3 sm:flex-row sm:items-start sm:gap-10 sm:py-4">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-1">
          <p className="text-body-2 text-[var(--color-500)] text-pretty underline-offset-[0.16em] decoration-[var(--accent)] transition-[text-decoration-color] duration-[400ms] ease-in-out group-hover:underline">
            <ScrambleText text={project.card.lead} active={hovered} />{' '}
            <span className="text-[var(--accent)] font-[450]">
              {project.card.number} {project.card.label}
            </span>
            {project.card.tail && <> {project.card.tail}</>}
          </p>
        </div>
      </div>
    </Link>
  )
}
