'use client'

import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/lib/projects'
import { useState, useEffect } from 'react'

const experience = [
  { years: '2022 - 2026', company: 'edrone', role: 'Senior Product Designer & Team Lead', logo: '/images/logo-edrone.png' },
  { years: '2021 - 2022', company: 'Deepsolver', role: 'Product Designer', logo: '/images/logo-deepsolver.png' },
  { years: '2019 - 2020', company: 'eq system', role: 'UX Designer', logo: '/images/logo-eqsystem.png' },
  { years: '2018', company: 'Inventive Software', role: 'Junior UX/UI Designer', logo: '/images/logo-inventive.png' },
]

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1040px] mx-auto px-6 h-14 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="h-7 w-7 flex items-center justify-center border border-border rounded-sm hover:bg-border/50 transition-colors"
            >
              {darkMode ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="h-7 px-2 text-[12px] font-mono border border-border rounded-sm hover:bg-border/50 transition-colors">
              EN / PL
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1040px] mx-auto px-6 pt-24 pb-16">
        <div className="flex gap-16">
          {/* Sidebar */}
          <aside className="w-[180px] shrink-0 sticky top-24 self-start hidden lg:block">
            {/* Avatar */}
            <div className="w-[100px] h-[100px] rounded-lg overflow-hidden mb-4 grayscale-[50%]">
              <Image
                src="/images/avatar.jpg"
                alt="Olaf Otrząsek"
                width={100}
                height={100}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            {/* Name */}
            <h2 className="font-display text-[20px] leading-tight mb-1">
              Olaf Otrząsek
            </h2>
            <p className="text-[14px] text-text-body mb-6">
              Senior Product Designer
            </p>

            {/* Contact links */}
            <div className="space-y-0">
              <a 
                href="mailto:olafotrzasek@gmail.com"
                className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all"
              >
                <span>olafotrzasek@gmail.com</span>
                <span className="opacity-0 group-hover:opacity-100 text-[#C8440A] transition-opacity">↗</span>
              </a>
              <a 
                href="/olaf-otrzasek-resume.pdf"
                target="_blank"
                className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all"
              >
                <span>Resume</span>
                <span className="opacity-0 group-hover:opacity-100 text-[#C8440A] transition-opacity">↗</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/olafotrzasek/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-2 border-b border-border text-[11px] font-mono uppercase tracking-wide text-text-caption hover:text-foreground hover:pl-1 transition-all"
              >
                <span>LinkedIn</span>
                <span className="opacity-0 group-hover:opacity-100 text-[#C8440A] transition-opacity">↗</span>
              </a>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mt-6">
              <span className="w-2 h-2 bg-[#22863A] rounded-sm" />
              <span className="text-[11px] font-mono uppercase tracking-wide text-[#22863A]">
                Open to opportunities
              </span>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Hero */}
            <section className="mb-16">
              <h1 className="font-display text-[42px] md:text-[52px] leading-[1.1] mb-6">
                I let the data find the <span className="text-[#C8440A]">opportunity.</span>
                <br />
                Then I design the experience.
              </h1>
              
              <p className="text-[16px] text-text-body leading-[1.75] max-w-[600px]">
                Senior Product Designer with 7+ years in B2B SaaS. I read the data, find the leverage point, ship fast, and measure what actually changed. Previously led design at{' '}
                <a href="https://edrone.me" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-[#C8440A] transition-colors">
                  edrone
                </a>
                {' '}— rebuilt the platform from sales-gated to self-serve freemium. Before that, sole designer at{' '}
                <a href="https://deepsolver.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-[#C8440A] transition-colors">
                  Deepsolver
                </a>
                {' '}— two products from zero to launch.
              </p>
            </section>

            {/* P→C→O Section */}
            <section className="mb-16 border-l-[3px] border-[#C8440A] pl-6">
              <h2 className="font-display text-[28px] leading-tight mb-4">
                <span className="line-through text-text-caption">Problem</span>{' '}
                <span className="line-through text-text-caption">Challenge</span>{' '}
                <span>Opportunity</span>
              </h2>
              <p className="text-[16px] text-text-body leading-[1.75]">
                Drop-offs, low usage, churn — not problems to fix. Signals showing where the product has room to grow. I&apos;ve stopped framing design as problem-solving. I frame it as opportunity capture.
              </p>
            </section>

            {/* Selected Projects */}
            <section className="mb-16">
              <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-8">
                Selected Projects
              </div>

              <div className="space-y-0">
                {projects.map((project, index) => (
                  <Link 
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <article className={`grid grid-cols-1 md:grid-cols-2 gap-6 py-8 ${index === 0 ? 'border-t' : ''} border-b border-border hover:bg-[#C8440A]/5 transition-colors -mx-4 px-4`}>
                      {/* Text */}
                      <div className="flex flex-col justify-center">
                        <h3 className="font-display text-[24px] leading-tight mb-2 group-hover:text-[#C8440A] transition-colors">
                          {project.title}
                          <span className="opacity-0 group-hover:opacity-100 ml-2 text-[#C8440A] transition-opacity">↗</span>
                        </h3>
                        <p className="text-[14px] text-text-body leading-[1.75] mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4">
                          {project.metrics.slice(0, 2).map((metric, i) => (
                            <div key={i} className="flex items-baseline gap-1">
                              <span className={`font-display text-[18px] ${metric.color === 'accent' ? 'text-[#C8440A]' : 'text-foreground'}`}>
                                {metric.value}
                              </span>
                              <span className="text-[11px] font-mono uppercase tracking-wide text-text-caption">
                                {metric.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <div className="relative overflow-hidden rounded-md border border-border group-hover:scale-[1.02] transition-all duration-300">
                        <Image
                          src={project.thumbnailImage}
                          alt={project.title}
                          width={480}
                          height={300}
                          className="w-full h-auto"
                          priority={index === 0}
                        />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className="mb-16">
              <div className="inline-block px-2 py-1 border border-border rounded-sm text-[11px] font-mono uppercase tracking-wide text-text-caption mb-8">
                Experience
              </div>

              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-[12px] font-mono text-text-caption w-[90px] shrink-0">
                      {exp.years}
                    </span>
                    <div className="w-[22px] h-[22px] rounded-sm bg-border flex items-center justify-center shrink-0 overflow-hidden">
                      {exp.logo ? (
                        <Image src={exp.logo} alt={exp.company} width={22} height={22} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-mono">{exp.company[0]}</span>
                      )}
                    </div>
                    <span className="text-[14px] text-text-caption">
                      {exp.company}
                    </span>
                    <span className="text-[14px] text-text-caption">/</span>
                    <span className="text-[14px] font-medium text-foreground">
                      {exp.role}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-between pt-8 border-t border-border text-[11px] font-mono text-text-caption">
              <span>© 2026 Olaf Otrząsek</span>
              <span>
                ✦ Built with{' '}
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Claude</a>
                {' & '}
                <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">v0.dev</a>
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}
