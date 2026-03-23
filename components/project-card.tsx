import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  imagePosition: 'left' | 'right'
}

export function ProjectCard({ project, imagePosition }: ProjectCardProps) {
  const coverImage = project.slug === 'project-1' ? '/images/project-1-cover.jpg' : null

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article
        className={`flex flex-col md:flex-row border border-border rounded-xl bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
          imagePosition === 'right' ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Image */}
        <div className="w-full md:w-1/2 bg-fill-subtle flex items-center justify-center md:min-h-[280px] overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project.title}
              width={400}
              height={280}
              className="w-full h-full object-cover"
              priority
            />
          ) : (
            <span className="text-[14px] font-medium text-text-caption">cover image</span>
          )}
        </div>

        {/* Text content */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h3 className="text-[16px] font-semibold text-foreground mb-2">
            {project.title}
          </h3>
          <p className="text-[14px] text-text-body line-clamp-2 mb-4">{project.tagline}</p>
          <p className="text-[14px] font-medium text-text-caption">
            {project.meta.company} · {project.meta.year}
          </p>
        </div>
      </article>
    </Link>
  )
}
