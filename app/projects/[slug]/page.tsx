import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects, getProject, getProjectNavigation } from '@/lib/projects'
import { SectionLabel } from '@/components/section-label'
import { ImagePlaceholder, ImageRow } from '@/components/image-placeholder'
import { Footer } from '@/components/footer'

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
          {/* Cover image placeholder */}
          <ImagePlaceholder height={360} className="mb-8 rounded-xl" label="cover image" />

          {/* Project title */}
          <h1 className="text-[28px] font-semibold text-foreground leading-tight mb-4">
            {project.title}
          </h1>

          {/* Meta lines */}
          <div className="space-y-1 text-[14px] font-medium text-text-caption mb-6">
            <p>{project.meta.year} · {project.meta.company}</p>
            <p>Role: {project.meta.role}</p>
            <p>Team: [placeholder]</p>
          </div>

          {/* Overview */}
          <p className="text-[16px] text-text-body leading-relaxed mb-8">
            {project.overview}
          </p>

          {/* First image after overview */}
          {project.process.length > 0 && project.process[0].type === 'image' && (
            <ImagePlaceholder
              height={360}
              src={project.process[0].src}
              label={project.process[0].label}
              alt={project.process[0].alt}
            />
          )}
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 2: Opportunity */}
        <section className="mb-16">
          <SectionLabel>Opportunity</SectionLabel>
          <div className="space-y-4">
            {project.opportunity.map((paragraph, index) => (
              <p key={index} className="text-[16px] text-text-body leading-relaxed">
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
          <div className="space-y-6">
            {project.process.map((block, index) => {
              if (index === 0) return null
              if (block.type === 'paragraph') {
                return (
                  <p key={index} className="text-[16px] text-text-body leading-relaxed">
                    {block.content}
                  </p>
                )
              }
              if (block.type === 'image') {
                return (
                  <ImagePlaceholder
                    key={index}
                    height={360}
                    src={block.src}
                    label={block.label}
                    alt={block.alt}
                  />
                )
              }
              if (block.type === 'image-row') {
                return <ImageRow key={index} images={block.images} />
              }
              return null
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 4: Results */}
        <section className="mb-16">
          <SectionLabel>Results</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.metrics.map((metric, index) => (
              <div key={index} className="text-left">
                <p className="text-[28px] font-semibold text-foreground mb-1">
                  {metric.value}
                </p>
                <p className="text-[14px] font-medium text-text-caption">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Project navigation */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            {/* Previous */}
            <div className="flex-1">
              {prev && (
                <Link href={`/projects/${prev.slug}`} className="group block">
                  <p className="text-[14px] font-medium text-text-caption mb-1">
                    ← Previous
                  </p>
                  <p className="text-[16px] font-semibold text-foreground group-hover:underline">
                    {prev.title}
                  </p>
                </Link>
              )}
            </div>

            {/* Next */}
            <div className="flex-1 md:text-right">
              {next && (
                <Link href={`/projects/${next.slug}`} className="group block">
                  <p className="text-[14px] font-medium text-text-caption mb-1">
                    Next →
                  </p>
                  <p className="text-[16px] font-semibold text-foreground group-hover:underline">
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
