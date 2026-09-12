'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getProject, getProjectNavigation } from '@/lib/projects'
import { Bold } from '@/components/bold'
import { ClickableDemo } from '@/components/clickable-demo'
import { ClickableImage } from '@/components/clickable-image'
import { CohortChart } from '@/components/cohort-chart'
import { MetricMain } from '@/components/metric-card'
import { BLEED_VISUAL, FRAME_PAD, ProcessBlocks } from '@/components/process-blocks'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SectionBadge } from '@/components/section-badge'
import { SectionNav, sectionId } from '@/components/section-nav'
import { useScramble } from '@/lib/use-scramble'

/** Its own badge, so the rail can carry it and it reads as a section rather
 *  than as a caption bolted to the header. */
const MY_ROLE = 'My Role'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = getProject(slug)

  if (!project) notFound()

  const { prev, next } = getProjectNavigation(slug)

  const prevLabel = useScramble(prev.title)
  const nextLabel = useScramble(next.title)

  // Charted metrics sort last, because a chart is taller than a bare number and
  // reads as the closing evidence. The chart belongs to its number, so the two
  // are never separate blocks.
  const plainMetrics = project.results.metrics.filter((m) => !m.chart)
  const chartedMetrics = project.results.metrics.filter((m) => m.chart)

  const hasReflections = project.reflections && project.reflections.length > 0

  // Context opens the page beside My Role: the facts of the product in one
  // column, the claim about the designer's part in it in the other, then the
  // rest of the narrative reads as its own sections under them. My Role stays
  // out of the rail — one shared row, and the legend reads as the sections.
  const firstSection = project.sections[0]

  const sectionItem = (badge: string) => ({ label: badge, target: sectionId(badge) })

  const navItems = [
    ...project.sections.map((section) => sectionItem(section.badge)),
    sectionItem('Impact'),
    ...(hasReflections ? [sectionItem('Reflections')] : []),
  ]

  return (
    // The rail hands back how much room the last section needs to be able to
    // reach the top of the window; without it the foot of the page is a set of
    // links that cannot be followed. Zero below 1200px, where there is no rail.
    <main id="main-content" className="min-h-screen bg-background" style={{ paddingBottom: 'var(--section-tail, 0px)' }}>
      <div className="max-w-[var(--measure)] mx-auto px-5 pt-[10rem] pb-16 flex flex-col gap-16">

        {/* Header */}
        <section>

          {/* Hero — a coded demo where the project has one, the cover PNG otherwise.
              It enlarges on click like the screenshots do, but skips the hover
              tint, which coded demos do not take anywhere else either. It sits
              flush with the card's bottom edge, the way the `center-bottom` covers
              do, so the screen reads as standing on the card rather than floating.
              The compact stage: the tall one is only needed further down the page,
              where the old four-field form has to fit beside this one. */}
          {project.demo ? (
            <div className={BLEED_VISUAL}>
              {/* The same mat as every other frame, minus its bottom: the hero
                  sits flush with the card's lower edge, the way the
                  `center-bottom` covers do, so the screen reads as standing on
                  the card rather than floating in it. */}
              <div
                className={`w-full rounded-sm ${FRAME_PAD} pb-0 sm:pb-0`}
                style={{ backgroundColor: 'var(--color-000)' }}
              >
                <ClickableDemo id={project.demo} label={project.title} variant="compact" />
              </div>
            </div>
          ) : (
            <div className={`group ${BLEED_VISUAL}`}>
              {/* Same mat, with the sides or the foot dropped where the cover
                  is meant to run off the edge rather than sit inside it. */}
              <div
                className={`w-full rounded-sm transition-colors duration-[400ms] ease-in-out group-hover:bg-[var(--color-100)] ${FRAME_PAD} ${
                  project.coverImagePosition === 'bottom-right' ? 'px-0 sm:px-0 pb-0 sm:pb-0'
                  : project.coverImagePosition === 'center-bottom' ? 'pb-0 sm:pb-0'
                  : ''
                }`}
                style={{ backgroundColor: 'var(--color-000)' }}
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

          {/* The card headline the homepage rows roll on, under the hero rather
              than above it: the screen first, the sentence that sums it up. The
              accent measure is kept from the home row. */}
          <div className="flex flex-col gap-3 mt-8">
            <h3 className="font-display text-[clamp(1.25rem,4vw,1.75rem)] leading-[1.2] text-balance">
              {project.card.lead}{' '}
              <span className="text-[var(--accent)] font-[450]">
                {project.card.number} {project.card.label}
              </span>
              {project.card.tail && <> {project.card.tail}</>}
            </h3>
          </div>

        </section>

        {/* Context and My Role share the first row: the facts of the product
            beside the claim about the designer's part in it. The rest of the
            narrative reads as its own sections under them.

            Deliberately not <Bold>: the role sentence is the designer's own
            claim about their own work, which is the one place
            CASE-STUDY-PATTERN.md says bold must never go. */}
        <div className="grid gap-16 sm:gap-10 md:grid-cols-2">
          {firstSection && (
            <section id={sectionId(firstSection.badge)}>
              <SectionBadge>{firstSection.badge}</SectionBadge>
              <ProcessBlocks blocks={firstSection.blocks} />
            </section>
          )}
          <section id={sectionId(MY_ROLE)}>
            <SectionBadge>{MY_ROLE}</SectionBadge>
            <p className="text-body-2 text-[var(--color-500)] text-pretty">
              {project.meta.myRole}
            </p>
          </section>
        </div>

        {project.sections.slice(1).map((section) => (
          <section key={section.badge} id={sectionId(section.badge)}>
            <SectionBadge>{section.badge}</SectionBadge>
            <ProcessBlocks blocks={section.blocks} />
          </section>
        ))}

        {/* Impact */}
        <section id={sectionId('Impact')}>
          <SectionBadge>Impact</SectionBadge>

          {/* Read the outcome in prose, then meet it again in the cards. The
              summary carries the story; the cards carry the definitions. */}
          {project.results.summary && (
            <p className="text-body-2 text-[var(--color-500)] text-pretty mb-8">
              <Bold text={project.results.summary} />
            </p>
          )}

          {/* One column on every case study. Cards were side by side here and
              stacked on freemium, which made the same section read as two
              different layouts. Stacked wins: a metric gets the full measure for
              its note, and a chart never has to share a row. */}
          <div className="flex flex-col gap-3 sm:-mx-8">
            {project.results.northStar && (
              <MetricMain
                label={project.results.northStar.label}
                value={project.results.northStar.value}
                /* The note defines the north-star number, so it belongs in that
                   card rather than orphaned at the bottom of the section. */
                note={project.results.note}
              />
            )}
            {plainMetrics.map((metric, index) => (
              <MetricMain key={index} label={metric.label} value={metric.value} note={metric.description} />
            ))}
            {chartedMetrics.map((metric, index) => (
              <MetricMain key={index} label={metric.label} value={metric.value} note={metric.description}>
                <CohortChart data={metric.chart!.data} seriesLabel={metric.chart!.seriesLabel} />
              </MetricMain>
            ))}
            {project.results.note && !project.results.northStar && (
              <div className={`${FRAME_PAD} rounded-sm`} style={{ backgroundColor: 'var(--color-000)' }}>
                <p className="text-body-2 text-[var(--color-500)] text-pretty"><Bold text={project.results.note} /></p>
              </div>
            )}
          </div>
        </section>

        {/* Reflections */}
        {hasReflections && (
          <section id={sectionId('Reflections')}>
            <SectionBadge>Reflections</SectionBadge>
            <div className="flex flex-col gap-4">
              {project.reflections.map((text, index) => (
                <p key={index} className="text-body-2 text-[var(--color-500)] text-pretty">
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
            className="group flex flex-col gap-1.5 p-3 -m-3"
            onMouseEnter={prevLabel.scramble}
            onMouseLeave={prevLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M14 8H2M7 3L2 8l5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
              <span className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">PREV\</span>
            </div>
            <span ref={prevLabel.spanRef} className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out text-balance">
              {prev.title}
            </span>
          </Link>

          {/* NEXT */}
          <Link
            href={`/projects/${next.slug}`}
            aria-label={`Next: ${next.title}`}
            className="group flex flex-col gap-1.5 items-end text-right p-3 -m-3"
            onMouseEnter={nextLabel.scramble}
            onMouseLeave={nextLabel.reset}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out">/NEXT</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-[var(--accent)] transition-colors duration-[400ms] ease-in-out shrink-0" style={{stroke:'currentColor'}}><path d="M2 8h12M9 3l5 5-5 5" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/></svg>
            </div>
            <span ref={nextLabel.spanRef} className="text-eyebrow text-[var(--color-300)] group-hover:text-[var(--accent)] transition-colors duration-[400ms] ease-in-out text-balance">
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
