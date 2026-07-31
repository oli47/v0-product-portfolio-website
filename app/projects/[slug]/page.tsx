'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProject, getProjectNavigation, type DemoId } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableImage } from '@/components/clickable-image'
import { DEMOS } from '@/components/demos/registry'
import { MetricMain, MetricSupporting } from '@/components/metric-card'
import { ProcessBlocks } from '@/components/process-blocks'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SectionBadge } from '@/components/section-badge'
import { SectionNav, sectionId } from '@/components/section-nav'
import { useScramble } from '@/lib/use-scramble'

// ─── Hero demo ───────────────────────────────────────────────────────────────

/** Autoplays on scroll like the in-body demos, so it needs no `play` prop. It
 *  takes the compact stage: the tall one is only needed further down the page,
 *  where the old four-field form has to fit next to this one. */
function HeroDemo({ id }: { id: DemoId }) {
  const Demo = DEMOS[id]
  return <Demo variant="compact" />
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

  const hasReflections = project.reflections && project.reflections.length > 0
  const navItems = [
    ...project.sections.map((section) => section.badge),
    'Impact',
    ...(hasReflections ? ['Reflections'] : []),
  ]

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

          {/* Hero — a coded demo where the project has one, the cover PNG otherwise.
              The demo card skips the hover tint and the lightbox: there is nothing
              to enlarge, and coded demos do not tint anywhere else either. It sits
              flush with the card's bottom edge, the way the `center-bottom` covers
              do, so the screen reads as standing on the card rather than floating. */}
          {project.demo ? (
            <div className="sm:-mx-8">
              <div
                className="w-full rounded-sm"
                // Wider inset at the sides than above; flush with the bottom
                // edge, the way the `center-bottom` covers sit.
                style={{ backgroundColor: 'var(--color-000)', padding: '2rem 4rem 0' }}
              >
                <HeroDemo id={project.demo} />
              </div>
            </div>
          ) : (
            <div className="group sm:-mx-8">
              <div
                className="w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)]"
                style={{
                  backgroundColor: 'var(--color-000)',
                  padding: project.coverImagePosition === 'bottom-right'
                    ? '1rem 0 0 0'
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
          )}

          {/* Project meta — role, team, duration */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mt-8 pt-6 border-t border-[var(--color-100)]">
            {([
              ['Role', project.meta.role],
              ['Team', project.meta.team],
              ['Duration', project.meta.duration],
            ] as const).map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <dt className="text-eyebrow text-[var(--color-400)]">{label.toUpperCase()}</dt>
                <dd className="text-body-2 text-[var(--color-500)] text-pretty">{value}</dd>
              </div>
            ))}
          </dl>

        </section>

        {/* Narrative sections — badges and order come from the project data */}
        {project.sections.map((section) => (
          <section key={section.badge} id={sectionId(section.badge)}>
            <SectionBadge>{section.badge}</SectionBadge>
            <ProcessBlocks blocks={section.blocks} />
          </section>
        ))}

        {/* Impact */}
        <section id={sectionId('Impact')}>
          <SectionBadge>Impact</SectionBadge>

          {project.results.northStar && project.results.note && project.results.metrics.length > 0 ? (
            /* 2-col layout: left = MetricMain (northStar), right = stacked MetricSupporting */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:-mx-8">
              <MetricMain
                label={project.results.northStar.label}
                value={project.results.northStar.value}
                note={project.results.note}
              />
              <div className="flex flex-col gap-3">
                {project.results.metrics.map((metric, index) => (
                  project.results.metricsAsMain
                    ? <MetricMain key={index} label={metric.label} value={metric.value} note={metric.description} />
                    : <MetricSupporting key={index} label={metric.label} value={metric.value} description={metric.description} />
                ))}
              </div>
            </div>
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
                    note={metric.description}
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

        {/* Reflections */}
        {hasReflections && (
          <section id={sectionId('Reflections')}>
            <SectionBadge>Reflections</SectionBadge>
            <div className="flex flex-col gap-4">
              {project.reflections.map((text, index) => (
                <p key={index} className="text-body-1 text-[var(--color-300)] text-pretty">
                  <Bold text={text} />
                </p>
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
      <SectionNav items={navItems} />
      <ScrollToTop />
    </main>
  )
}
