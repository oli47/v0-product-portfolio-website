import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Text content - left side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1">
          {/* Title - body-1-bold: 16/160 */}
          <h3 className="text-[16px] font-semibold text-foreground leading-[160%] mb-1">
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
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border">
            <Image
              src={project.thumbnailImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
