import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects, getProject, getProjectNavigation } from '@/lib/projects'
import { SectionLabel } from '@/components/section-label'
import { Footer } from '@/components/footer'
import { CompareSlider } from '@/components/compare-slider'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    return { title: 'Project Not Found' }
  }

  return {
    title: `${project.title} · Olaf Otrząsek`,
    description: project.overview,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    notFound()
  }

  const { prev, next } = getProjectNavigation(slug)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-text-caption hover:text-foreground transition-colors mb-8"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>

        {/* Section 1: Header */}
        <section className="mb-16">
          {/* Cover image */}
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-border mb-8">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Project title - h2: 28/160 */}
          <h1 className="text-[28px] font-semibold text-foreground leading-[160%] mb-2">
            {project.title}
          </h1>

          {/* Tagline - h3-regular: 24/160 */}
          <p className="text-[24px] text-text-body leading-[160%] mb-8">
            {project.tagline}
          </p>

          {/* Meta info - grid like metrics but smaller */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-[14px] text-text-caption leading-[160%] mb-0.5">Role</p>
              <p className="text-[14px] font-semibold text-foreground leading-[160%]">{project.meta.role}</p>
            </div>
            <div>
              <p className="text-[14px] text-text-caption leading-[160%] mb-0.5">Team</p>
              <p className="text-[14px] font-semibold text-foreground leading-[160%]">{project.meta.team}</p>
            </div>
            <div>
              <p className="text-[14px] text-text-caption leading-[160%] mb-0.5">Date</p>
              <p className="text-[14px] font-semibold text-foreground leading-[160%]">{project.meta.year}</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Overview section */}
        <section className="mb-16">
          <SectionLabel>Overview</SectionLabel>
          <p className="text-[16px] text-text-body leading-[160%] mb-6">
            {project.overview}
          </p>
          
          {/* Overview image if exists */}
          {project.overviewImage && (
            <div className="relative w-full rounded-lg overflow-hidden border border-border">
              <Image
                src={project.overviewImage}
                alt="Overview diagram"
                width={720}
                height={400}
                className="w-full h-auto"
              />
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 2: Opportunity */}
        <section className="mb-16">
          <SectionLabel>Opportunity</SectionLabel>
          <div className="space-y-4">
            {project.opportunity.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-text-body leading-[160%]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 3: Decision */}
        <section className="mb-16">
          <SectionLabel>Decision</SectionLabel>
          <div className="space-y-4">
            {project.decision.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-text-body leading-[160%]">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Compare slider only for signup-redesign project */}
          {project.slug === 'signup-redesign' && (
            <div className="mt-8">
              <CompareSlider />
            </div>
          )}

          {/* Decision image for other projects */}
          {project.decisionImage && project.slug !== 'signup-redesign' && (
            <div className="relative w-full rounded-lg overflow-hidden border border-border mt-8">
              <Image
                src={project.decisionImage}
                alt="Decision visualization"
                width={720}
                height={400}
                className="w-full h-auto"
              />
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 4: Results */}
        <section className="mb-16">
          <SectionLabel>Results</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.metrics.map((metric, index) => (
              <div key={index}>
                {/* Value - h2: 28/160 */}
                <p className="text-[28px] font-semibold text-foreground leading-[160%] mb-1">
                  {metric.value}
                </p>
                {/* Label - body-2: 14/160 */}
                <p className="text-[14px] text-text-caption leading-[160%]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps section if exists */}
        {project.nextSteps && project.nextSteps.length > 0 && (
          <>
            <div className="h-px bg-border mb-16" />
            <section className="mb-16">
              <SectionLabel>Next Steps</SectionLabel>
              <ul className="space-y-3">
                {project.nextSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-text-caption mt-1">+</span>
                    <p className="text-[16px] text-text-body leading-[160%]">
                      {step}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* Project navigation */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {/* Previous */}
            <div className="flex-1">
              {prev && (
                <Link href={`/projects/${prev.slug}`} className="group block">
                  <p className="text-[14px] text-text-caption leading-[160%] mb-1">
                    ← Previous
                  </p>
                  <p className="text-[16px] font-semibold text-foreground leading-[160%] group-hover:underline">
                    {prev.title}
                  </p>
                </Link>
              )}
            </div>

            {/* Next */}
            <div className="flex-1 md:text-right">
              {next && (
                <Link href={`/projects/${next.slug}`} className="group block">
                  <p className="text-[14px] text-text-caption leading-[160%] mb-1">
                    Next →
                  </p>
                  <p className="text-[16px] font-semibold text-foreground leading-[160%] group-hover:underline">
                    {next.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mt-8" />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
