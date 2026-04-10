import { projects } from '@/lib/projects'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://olafotrzasek.com'

  const projectRoutes = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...projectRoutes,
  ]
}
