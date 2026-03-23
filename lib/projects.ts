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
    src?: string
    label?: string
    alt?: string
    images?: Array<{ src: string; label: string; alt?: string }>
  }[]
  metrics: {
    value: string
    label: string
  }[]
}

export const projects: Project[] = [
  {
    slug: 'project-1',
    title: 'Signup Redesign',
    tagline: 'Removed one field, split into two steps, shipped in 5 hours. +40% signups on desktop, +300% on mobile within 7 days.',
    meta: {
      role: 'Senior Product Designer',
      company: 'edrone',
      companyUrl: 'https://edrone.me',
      year: '2026',
    },
    overview:
      'edrone\'s signup was the entry point into a freemium e-commerce platform. I spotted a critical drop-off, designed the fix, coded it myself using AI, and shipped it the same day. Total time: under 5 hours.',
    opportunity: [
      'Amplitude data showed massive abandonment at the signup form. Two compounding issues were hiding in plain sight. The phone number field was the top drop-off point, confirmed by event data, a UX audit, and competitive benchmarks. A quick check with Sales confirmed they no longer needed phone numbers for lead qualification. The field was just still there.',
      'On top of that, Google SSO was broken because the single-page layout could not handle the redirect flow properly, so a fast and trusted signup method was silently failing. Two friction points, one root cause: a form that had not been questioned in years.',
    ],
    process: [
      { 
        type: 'image',
        src: '/images/project-1-signup-old.jpg',
        label: 'The old form',
        alt: 'Original single-page signup form'
      },
      { type: 'paragraph', content: 'I could have run two separate A/B tests over 6 weeks. Instead, I made one call: remove the phone field and split the form into two steps at once. Step 1: Email or Google SSO, account created immediately. Step 2: Name and store URL. This fixed the SSO flow structurally and eliminated the biggest friction point in one move.' },
      { type: 'paragraph', content: 'I built the entire solution myself using Codex, going from design to working code without waiting on dev resources, then shipped after a light code review with one front-end dev.' },
      {
        type: 'image-row',
        images: [
          { src: '/images/project-1-signup-old.jpg', label: 'Before', alt: 'Original form' },
          { src: '/images/project-1-signup-new-1.jpg', label: 'After — Step 1', alt: 'New step 1' },
          { src: '/images/project-1-signup-new-2.jpg', label: 'After — Step 2', alt: 'New step 2' }
        ]
      }
    ],
    metrics: [
      { value: '+40%', label: 'signup rate desktop · 7 days' },
      { value: '+300%', label: 'signup rate mobile · 7 days' },
      { value: '+50%', label: 'integration rate increase' },
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
