'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProject, getProjectNavigation } from '@/lib/projects'
import type { ProcessBlock } from '@/lib/projects'
import { SectionBadge } from '@/components/section-badge'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Slideshow } from '@/components/slideshow'
import { Lightbox } from '@/components/lightbox'
import { Bold } from '@/components/bold'
import { MetricMain, MetricSupporting } from '@/components/metric-card'
import { CompareSlider } from '@/components/compare-slider'
import { BeforeAfterFlow, VerticalFlow, ContactFlowDiagram } from '@/components/process-diagrams'
import { useScramble } from '@/lib/use-scramble'
import { useState, useRef } from 'react'

// ─── Clickable image ─────────────────────────────────────────────────────────

function ClickableImage({ src, alt, width, height, className, priority, objectPosition }: {
  src: string; alt: string; width: number; height: number; className?: string; priority?: boolean; objectPosition?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`Enlarge image: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          unoptimized={src.endsWith('.gif')}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 680px"
          className={`${className} pointer-events-none transition-opacity duration-[400ms] ease-in-out hover:opacity-80`}
          style={objectPosition ? { objectPosition } : undefined}
          priority={priority}
        />
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

// ─── Placeholder image ───────────────────────────────────────────────────────

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={`w-full flex items-center justify-center border border-dashed border-[var(--color-100)] rounded-sm bg-[var(--color-000)] ${className ?? ''}`}
      style={{ minHeight: '13.75rem' }}
    >
      <span className="text-eyebrow text-[var(--color-200)]">Image placeholder</span>
    </div>
  )
}

// ─── Image caption ───────────────────────────────────────────────────────────

function Caption({ text }: { text: string }) {
  return (
    <p className="text-body-2 text-[var(--color-300)] mt-3 text-pretty text-center">
      {text}
    </p>
  )
}

// ─── Process block renderer ──────────────────────────────────────────────────
// (CompareSlider, flow diagrams, MetricMain/Supporting, Bold now in components/)


function ProcessBlocks({ blocks }: { blocks: ProcessBlock[] }) {
  // Group consecutive text/heading blocks so they share gap-4,
  // while all other blocks are separated by gap-16.
  type TextBlock = Extract<ProcessBlock, { kind: 'text' | 'heading' }>
  type NonTextBlock = Exclude<ProcessBlock, { kind: 'text' | 'heading' }>
  type GroupedItem = TextBlock[] | NonTextBlock

  const grouped: GroupedItem[] = []
  let run: TextBlock[] = []
  for (const block of blocks) {
    if (block.kind === 'text' || block.kind === 'heading') {
      run.push(block as TextBlock)
    } else {
      if (run.length) { grouped.push(run); run = [] }
      grouped.push(block as NonTextBlock)
    }
  }
  if (run.length) grouped.push(run)

  return (
    <div className="flex flex-col gap-16">
      {grouped.map((item, i) => {
        if (Array.isArray(item)) {
          return (
            <div key={i} className="flex flex-col gap-4">
              {item.map((block, j) =>
                block.kind === 'text' ? (
                  <p key={j} className="text-body-1 text-[var(--color-300)] text-pretty">
                    <Bold text={block.content} />
                  </p>
                ) : (
                  <p key={j} className="text-body-1 text-[var(--color-500)] font-medium text-pretty">
                    <Bold text={block.content} />
                  </p>
                )
              )}
            </div>
          )
        }
        const block = item
        switch (block.kind) {
          case 'placeholder':
            return (
              <div key={i} className="sm:-mx-8">
                <PlaceholderImage />
                {block.caption && <Caption text={block.caption} />}
              </div>
            )

          case 'image':
            return (
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <div className="rounded-[0.125rem] overflow-hidden mb-4">
                    <ClickableImage
                      src={block.src}
                      alt={block.caption ?? 'Process image'}
                      width={680}
                      height={425}
                      className="w-full h-auto"
                    />
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-0">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )

          case 'slideshow':
            return (
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <Slideshow images={block.images} />
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-4">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )

          case 'compare':
            return (
              <div key={i} className="group sm:-mx-8">
                <div
                  className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)]"
                  style={{ backgroundColor: 'var(--color-000)', padding: '1rem 1rem 1.25rem' }}
                >
                  <div className="rounded-[0.125rem] overflow-hidden mb-4">
                    <CompareSlider
                      beforeImage={block.images[0].src}
                      afterImages={block.images.slice(1)}
                    />
                  </div>
                  {block.caption && (
                    <p className="text-body-2 text-[var(--color-300)] text-center mt-0">
                      {block.caption}
                    </p>
                  )}
                </div>
              </div>
            )

          case 'vertical-flow':
            return <VerticalFlow key={i} steps={block.steps} arc={block.arc} caption={block.caption} />

          case 'before-after-flow':
            return <BeforeAfterFlow key={i} before={block.before} after={block.after} caption={block.caption} />

          case 'contact-flow':
            return <ContactFlowDiagram key={i} caption={block.caption} />

          case 'steps':
            return (
              <div key={i} className="space-y-8 sm:-mx-8">
                {block.items.map((step, j) => (
                  <div key={j} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image or placeholder — narrower on desktop */}
                    <div className="w-full sm:w-[44%] shrink-0">
                      {step.imageSrc ? (
                        <div className="relative w-full rounded-sm overflow-hidden border border-[var(--color-100)]" style={{ backgroundColor: 'var(--color-000)' }}>
                          <ClickableImage
                            src={step.imageSrc}
                            alt={step.title}
                            width={300}
                            height={200}
                            className="w-full h-auto"
                          />
                        </div>
                      ) : (
                        <PlaceholderImage className="h-full" />
                      )}
                    </div>

                    {/* Number + title + description */}
                    <div className="flex flex-col gap-1.5 justify-center">
                      <span className="text-eyebrow text-[var(--accent)]">{step.num}</span>
                      <p className="text-body-1 font-medium text-[var(--color-500)]">{step.title}</p>
                      <p className="text-body-2 text-[var(--color-300)] text-pretty">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )

          case 'decisions': {
            const count = block.items.length
            return (
              <div key={i} className="sm:-mx-8 grid grid-cols-1 sm:grid-cols-2 rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--color-000)' }}>
                {block.items.map((item, j) => {
                  const isLeftCol   = j % 2 === 0
                  const isLastRow   = j >= count - 2  // bottom row on desktop
                  const isLast      = j === count - 1
                  return (
                    <div
                      key={j}
                      className={[
                        'p-5 flex flex-col gap-3',
                        isLeftCol ? 'sm:border-r border-[var(--color-100)]' : '',
                        !isLast ? 'border-b border-[var(--color-100)]' : '',
                        isLastRow && !isLast ? 'sm:border-b-0' : '',
                      ].join(' ')}
                    >
                      <span className="text-eyebrow text-[var(--accent)]">{item.num}</span>
                      <div className="flex flex-col gap-2">
                        <p className="text-body-1 text-[var(--color-500)] text-pretty" style={{ fontWeight: 600 }}>{item.title}</p>
                        <p className="text-body-2 text-[var(--color-300)] text-pretty"><Bold text={item.description} /></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}


// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  const metricsGridCols = project.results.metrics.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2'

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="max-w-[45rem] mx-auto px-5 pt-[10rem] pb-16 flex flex-col gap-16">

        {/* Header */}
        <section>
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="font-display text-[clamp(1.5rem,7vw,2.625rem)] leading-[1.2] text-balance">
              {project.title}
            </h1>
            <p className="text-body-1 text-[var(--color-300)] text-balance">
              {project.tagline}
            </p>
          </div>

          {/* Hero image */}
          <div className="group sm:-mx-8">
            <div
              className="w-full rounded-sm border border-[var(--color-100)] transition-colors duration-[400ms] ease-in-out group-hover:border-[var(--color-150)] group-hover:bg-[var(--color-100)]"
              style={{
                backgroundColor: 'var(--color-000)',
                padding: project.coverImagePosition === 'bottom-right'
                  ? '1rem 0 0 1rem'
                  : project.coverImagePosition === 'center-bottom'
                  ? '1rem 1rem 0'
                  : '1rem 1rem 1.25rem',
              }}
            >
              <div className="rounded-[0.125rem] overflow-hidden">
                <ClickableImage
                  src={project.coverImage}
                  alt={project.title}
                  width={680}
                  height={425}
                  className="w-full h-auto"
                  priority={true}
                />
              </div>
            </div>
          </div>

        </section>

        {/* Opportunity */}
        <section>
          <SectionBadge>Opportunity</SectionBadge>
          <ProcessBlocks blocks={project.opportunityBlocks} />
        </section>

        {/* Process */}
        <section>
          <SectionBadge>Approach</SectionBadge>
          <ProcessBlocks blocks={project.processContent} />
        </section>

        {/* Impact */}
        <section>
          <SectionBadge>Impact</SectionBadge>

          {project.results.northStar && project.results.note && project.results.metrics.length > 0 ? (
            /* 2-col layout: left = MetricMain (northStar), right = stacked MetricSupporting */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:-mx-8">
                <MetricMain
                  label={project.results.northStar.label}
                  value={project.results.northStar.value}
                  note={project.results.note!}
                />
                <div className="flex flex-col gap-3">
                  {project.results.metrics.map((metric, index) => (
                    project.results.metricsAsMain
                      ? <MetricMain key={index} label={metric.label} value={metric.value} note={metric.description} />
                      : <MetricSupporting key={index} label={metric.label} value={metric.value} description={metric.description} />
                  ))}
                </div>
              </div>
              {project.results.subheadline && (
                <div className="mt-3 p-5 rounded-sm sm:-mx-8" style={{ backgroundColor: 'var(--color-000)' }}>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty"><Bold text={project.results.subheadline} /></p>
                </div>
              )}
            </>
          ) : project.results.northStar && project.results.note && project.results.metrics.length === 0 ? (
            /* Single-wide: one MetricMain full-width */
            <MetricMain
              label={project.results.northStar.label}
              value={project.results.northStar.value}
              note={project.results.note}
              className="sm:-mx-8"
            />
          ) : (
            /* Default layout: grid of MetricMain cards */
            <>
              {project.results.northStar && (
                <MetricMain
                  label={project.results.northStar.label}
                  value={project.results.northStar.value}
                  className="mb-3 sm:-mx-8"
                />
              )}
              <div className={`grid gap-3 sm:-mx-8 ${metricsGridCols}`}>
                {project.results.metrics.map((metric, index) => (
                  <MetricMain
                    key={index}
                    label={metric.label}
                    value={metric.value}
                  />
                ))}
              </div>
              {project.results.note && (
                <div className="mt-3 p-5 rounded-sm sm:-mx-8" style={{ backgroundColor: 'var(--color-000)' }}>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty"><Bold text={project.results.note} /></p>
                </div>
              )}
            </>
          )}
        </section>

        {/* What's Next */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <section>
            <SectionBadge>{"What's Next"}</SectionBadge>
            <div className="space-y-6">
              {project.nextSteps.map((step, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-[var(--accent)] shrink-0 rounded-[1px]" aria-hidden="true" />
                    <p className="text-body-1 text-[var(--color-500)] text-pretty" style={{ fontWeight: 600 }}>{step.title}</p>
                  </div>
                  <p className="text-body-1 text-[var(--color-300)] text-pretty">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Project navigation */}
        <div className="flex items-start justify-between gap-8 mt-12">

          {/* PREV */}
          <Link
            href={`/projects/${prev.slug}`}
            aria-label={`Previous: ${prev.title}`}
            className="group flex flex-col gap-1.5"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M14 8H2M7 3L2 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
              <span className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">PREV\</span>
            </div>
            <span ref={prevLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {prev.title}
            </span>
          </Link>

          {/* NEXT */}
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="group flex flex-col gap-1.5 items-end text-right"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-eyebrow text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">/NEXT</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--color-400)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M2 8h12M9 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
            </div>
            <span ref={nextLabel.spanRef} className="text-eyebrow text-[clamp(1rem,3vw,1.25rem)] leading-[1.3] text-[var(--color-500)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out uppercase text-balance">
              {next.title}
            </span>
          </Link>

        </div>

      </div>
      <ScrollToTop />
    </main>
  )
}
