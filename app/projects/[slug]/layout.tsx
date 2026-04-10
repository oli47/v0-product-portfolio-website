import { getProject, projects } from '@/lib/projects'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = getProject(params.slug)
  if (!project) return {}

  const title = `${project.title} — Olaf Otrząsek`
  const url = `https://olafotrzasek.com/projects/${params.slug}`

  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/projects/${params.slug}` },
    openGraph: {
      title,
      description: project.tagline,
      url,
      images: [{ url: project.coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.tagline,
      images: [project.coverImage],
    },
  }
}

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  const project = getProject(params.slug)

  const jsonLd = project ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.tagline,
    author: { '@type': 'Person', name: 'Olaf Otrząsek', url: 'https://olafotrzasek.com' },
    url: `https://olafotrzasek.com/projects/${params.slug}`,
    image: project.coverImage,
  } : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
