import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="flex flex-col md:flex-row gap-6 md:gap-8 transition-opacity duration-200 hover:opacity-80">
        {/* Text content - left side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1">
          {/* Title - body-1-bold: 16/160 */}
          <h3 className="text-[16px] font-semibold text-foreground leading-[160%] mb-1 group-hover:text-gray-600 transition-colors duration-200">
            {project.title}
          </h3>
          {/* Tagline - body-1: 16/160 */}
          <p className="text-[16px] text-text-body leading-[160%] mb-2">
            {project.tagline}
          </p>
          {/* Year - body-2: 14/160 */}
          <p className="text-[14px] text-text-caption leading-[160%]">
            {project.meta.year}
          </p>
        </div>

        {/* Image - right side */}
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <div className="relative w-full overflow-hidden rounded-lg border border-border transition-shadow duration-200 group-hover:shadow-md">
            <Image
              src={project.thumbnailImage}
              alt={project.title}
              width={640}
              height={400}
              sizes="(max-width: 768px) 100vw, 320px"
              priority={priority}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
