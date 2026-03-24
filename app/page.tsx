import Image from 'next/image'
import { projects } from '@/lib/projects'
import { SectionLabel } from '@/components/section-label'
import { ProjectCard } from '@/components/project-card'
import { ExperienceTimeline } from '@/components/experience-timeline'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
        {/* Section 1: Intro */}
        <section className="mb-16">
          {/* Avatar - 15% larger (64 -> 74px) */}
          <div className="w-[74px] h-[74px] rounded-[16px] overflow-hidden mb-6">
            <Image
              src="/images/avatar.jpg"
              alt="Olaf Otrząsek"
              width={74}
              height={74}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Headline - h1: 32/160 */}
          <h1 className="text-[32px] font-semibold text-foreground leading-[160%] mb-6">
            Senior Product Designer building SaaS that performs.
          </h1>

          {/* Body paragraphs - body-1: 16/160 */}
          <div className="space-y-4 text-[16px] text-text-body leading-[160%]">
            <p>
              {"I'm Olaf, a Warsaw-based product designer with 7+ years of experience in B2B SaaS. I rebuild broken products, design self-serve growth models, and ship code using Codex when waiting on dev capacity is not an option."}
            </p>
            <p>
              Previously led design at{' '}
              <a
                href="https://edrone.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                edrone
              </a>
              , where I rebuilt the entire product and took it from sales-gated to self-serve freemium. Before that, sole designer at{' '}
              <a
                href="https://deepsolver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                Deepsolver
              </a>
              , taking two products from zero to launch.
            </p>
          </div>

          {/* Links row - body-2: 14/160 */}
          <div className="flex items-center gap-2 mt-6 text-[14px] leading-[160%] text-text-caption flex-wrap">
            <a
              href="https://www.linkedin.com/in/olafotrzasek/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-text-caption">·</span>
            <a
              href="https://dribbble.com/olvsky"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Dribbble
            </a>
            <span className="text-text-caption">·</span>
            <a
              href="mailto:olafotrzasek@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              olafotrzasek@gmail.com
            </a>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 2: Selected Work */}
        <section className="mb-16">
          <SectionLabel>Selected Work</SectionLabel>
          <div className="space-y-12">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-border mb-16" />

        {/* Section 3: Experience */}
        <section className="mb-16">
          <SectionLabel>Experience</SectionLabel>
          <ExperienceTimeline />
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
