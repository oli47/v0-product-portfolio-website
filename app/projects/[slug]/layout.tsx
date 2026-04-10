import { getProject } from '@/lib/projects'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = getProject(params.slug)
  if (!project) return {}

  return {
    title: `${project.title} — Olaf Otrząsek`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — Olaf Otrząsek`,
      description: project.tagline,
      images: [{ url: project.coverImage }],
    },
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
