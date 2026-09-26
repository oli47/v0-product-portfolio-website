'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCursorFollow } from '@/components/cursor-follow'
import { DEMOS } from '@/components/demos/registry'
import { CardSentence } from '@/components/card-sentence'
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
      {/* The screen sits in a fixed mat, not a fixed slot: the same padding
          on top and both sides on every card (and below on a phone), with the
          card as tall as its screen needs. The stages are not all one shape
          (freemium 1.78, signup 1.81, contacts 1.84), so a fixed slot could
          only give them equal margins by cropping or padding the screens. A
          few px of height between cards is the invisible side of that trade. */}
      <div className="overflow-hidden rounded-[0.125rem] bg-[var(--color-000)] p-4 sm:px-6 sm:pt-6 sm:pb-0 transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]">
        <div className="demo-lift overflow-hidden rounded-[0.125rem]" data-lift={hovered}>
          {Demo ? (
            <Demo variant="card" play={hovered} />
          ) : (
            <Image
              src={project.thumbnailImage}
              alt=""
              width={680}
              height={423}
              quality={95}
              sizes="(max-width: 640px) 100vw, 514px"
              className="h-auto w-full"
            />
          )}
        </div>
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
            <CardSentence text={project.card.text} scramble active={hovered} />
          </p>
        </div>
      </div>
    </Link>
  )
}
