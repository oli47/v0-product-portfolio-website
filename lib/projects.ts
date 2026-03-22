export interface Project {
  slug: string
  title: string
  tagline: string
  meta: {
    role: string
    company: string
    companyUrl: string
    year: string
  }
  overview: string
  opportunity: string[]
  process: {
    type: 'paragraph' | 'image' | 'image-row'
    content?: string
  }[]
  metrics: {
    value: string
    label: string
  }[]
}

export const projects: Project[] = [
  {
    slug: 'project-1',
    title: '[Project Title]',
    tagline: '[Verb] [what] — resulting in [metric] within [timeframe].',
    meta: {
      role: 'Senior Product Designer',
      company: 'edrone',
      companyUrl: 'https://edrone.me',
      year: '2024–2025',
    },
    overview:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    opportunity: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    process: [
      { type: 'paragraph', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { type: 'image' },
      { type: 'image-row' },
      { type: 'paragraph', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.' },
      { type: 'image' },
      { type: 'paragraph', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
      { type: 'paragraph', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
      { type: 'image' },
      { type: 'image-row' },
    ],
    metrics: [
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '−X%', label: '[Metric name] decrease · [timeframe]' },
    ],
  },
  {
    slug: 'project-2',
    title: '[Project Title]',
    tagline: '[Verb] [what] — resulting in [metric] within [timeframe].',
    meta: {
      role: 'Senior Product Designer',
      company: 'edrone',
      companyUrl: 'https://edrone.me',
      year: '2023–2024',
    },
    overview:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    opportunity: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    process: [
      { type: 'paragraph', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { type: 'image' },
      { type: 'image-row' },
      { type: 'paragraph', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.' },
      { type: 'image' },
      { type: 'paragraph', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
      { type: 'paragraph', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
      { type: 'image' },
      { type: 'image-row' },
    ],
    metrics: [
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '−X%', label: '[Metric name] decrease · [timeframe]' },
    ],
  },
  {
    slug: 'project-3',
    title: '[Project Title]',
    tagline: '[Verb] [what] — resulting in [metric] within [timeframe].',
    meta: {
      role: 'Product Designer',
      company: 'Deepsolver',
      companyUrl: 'https://deepsolver.com',
      year: '2021–2022',
    },
    overview:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    opportunity: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    process: [
      { type: 'paragraph', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { type: 'image' },
      { type: 'image-row' },
      { type: 'paragraph', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.' },
      { type: 'image' },
      { type: 'paragraph', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
      { type: 'paragraph', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
      { type: 'image' },
      { type: 'image-row' },
    ],
    metrics: [
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '+X%', label: '[Metric name] increase · [timeframe]' },
      { value: '−X%', label: '[Metric name] decrease · [timeframe]' },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getProjectNavigation(slug: string): {
  prev: Project | null
  next: Project | null
} {
  const index = projects.findIndex((p) => p.slug === slug)
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  }
}
