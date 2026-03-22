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
          {/* Avatar placeholder */}
          <div className="w-16 h-16 rounded-[14px] bg-[#e8e8e8] mb-6" />

          {/* Headline */}
          <h1 className="text-[28px] font-semibold text-foreground leading-tight mb-6">
            Senior Product Designer building SaaS that performs.
          </h1>

          {/* Body paragraphs */}
          <div className="space-y-4 text-[16px] text-text-body leading-relaxed">
            <p>
              {"I'm Olaf, a Warsaw-based product designer with 7+ years of experience. I build SaaS products where smart UX and AI meet business outcomes — from system thinking to the last pixel."}
            </p>
            <p>
              Currently leading design at{' '}
              <a
                href="https://edrone.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-semibold hover:underline"
              >
                edrone
              </a>
              . Previously sole designer at{' '}
              <a
                href="https://deepsolver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-semibold hover:underline"
              >
                Deepsolver
              </a>
              , where I took two products from zero to launch. I use AI as a core part of my design process, think in systems, and code enough to go from prototype to production.
            </p>
          </div>

          {/* Links row */}
          <div className="flex items-center gap-4 mt-6 text-[14px] font-medium text-text-caption flex-wrap">
            <a
              href="https://www.linkedin.com/in/olafotrzasek/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://dribbble.com/olvsky"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              Dribbble
            </a>
            <a
              href="mailto:olafotrzasek@gmail.com"
              className="hover:text-foreground hover:underline transition-colors"
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
          <div className="space-y-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                imagePosition={index % 2 === 0 ? 'left' : 'right'}
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
