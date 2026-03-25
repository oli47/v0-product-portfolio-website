export interface Project {
  slug: string
  title: string
  tagline: string
  meta: {
    role: string
    team: string
    year: string
  }
  coverImage: string
  thumbnailImage: string
  overview: string
  overviewImage?: string
  opportunity: string[]
  decision: string[]
  decisionImage?: string
  metrics: {
    value: string
    label: string
  }[]
  nextSteps?: string[]
}

export const projects: Project[] = [
  {
    slug: 'signup-redesign',
    title: 'Signup Flow',
    tagline: 'Removed one field, split into two steps, shipped in 5 hours. +40% signups on desktop, +300% on mobile within 7 days.',
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end developer',
      year: '2026',
    },
    coverImage: '/images/thumbnail1.jpg',
    thumbnailImage: '/images/thumbnail1.jpg',
    overview: "edrone's signup was the entry point into a freemium e-commerce platform. Amplitude showed massive drop-off at the form. I found the cause, designed the fix, coded it using Codex, and shipped it the same day. Total time: under 5 hours.",
    opportunity: [
      'The phone number field was the top drop-off point, confirmed by Amplitude event data, a UX audit, and competitive benchmarks. A quick check with Sales confirmed they no longer needed it for qualification. The field was just still there.',
      'On top of that, Google SSO was broken because the single-page layout could not handle the redirect flow properly — a fast and trusted signup method was silently failing.',
    ],
    decision: [
      'I could have run two separate A/B tests over 6 weeks. Instead, I made one call: remove the phone field and split the form into two steps at once. Step 1: Email or Google SSO, account created immediately. Step 2: Name and store URL. This fixed the SSO flow structurally and eliminated the biggest friction point in one move.',
      'Built the entire solution in Codex, shipped after a light code review with one front-end dev.',
    ],
    metrics: [
      { value: '+40%', label: 'Signup rate, desktop, first 7 days' },
      { value: '+300%', label: 'Signup rate, mobile, first 7 days' },
      { value: '+50%', label: 'Integration rate increase' },
    ],
    nextSteps: [
      'Creating an account takes up to 30 seconds, causing users to abandon the process.',
      'By entering the store\'s URL, we create personalized and branded communication for the store, but the user is unaware of this.',
      'Users coming from e-commerce marketplaces rather than the edrone website could have their accounts automatically created through authentication by those platforms, e.g., Shopify, Shoper, Tiendanube, etc.',
    ],
  },
  {
    slug: 'freemium-activation',
    title: 'Freemium Activation',
    tagline: "Designed edrone's entire self-serve path from scratch, turning a sales-gated product into a scalable growth engine with TBA% visitor-to-active-user activation within 10 months.",
    meta: {
      role: 'Sr Product Designer',
      team: '3 Front-end, 2 Back-end developers',
      year: '2025-2026',
    },
    coverImage: '/images/thumbnail2.jpg',
    thumbnailImage: '/images/thumbnail2.jpg',
    overview: 'Before freemium, every new edrone customer required a Sales call, manual onboarding, and hand-holding from Support. I designed the full model end-to-end: signup, onboarding, integration, feature activation, and Stripe payment.',
    overviewImage: '/images/activationflow.jpg',
    opportunity: [
      "edrone's growth had a hard ceiling: Sales. Every new user was expensive to acquire and slow to activate. Amplitude showed where users were abandoning the self-serve path before it even existed. The opportunity was to let the product sell itself.",
    ],
    decision: [
      'The hardest problem was not the paywall — it was activation. Free tier set at 500 messages per month: enough to generate measurable ROI for a small store, not enough to stay free forever if the product works. The upgrade is 2 clicks via Stripe.',
      'The bigger decision was flipping the activation flow. Originally, platform integration was a hard gate before users could enter edrone. I reversed it: users first see what will activate after they connect, then make a conscious choice to integrate. Integration rate dropped. Activated users increased. The business impact was stronger, because the users who integrated actually used the product.',
    ],
    decisionImage: '/images/activationwidget.jpg',
    metrics: [
      { value: 'TBA', label: 'Created accounts, TBA% growth May to March' },
      { value: 'TBA', label: 'Integrated users, TBA% growth' },
      { value: 'TBA', label: 'Activated users, TBA% growth' },
      { value: 'TBA', label: 'Paid users, TBA% growth' },
      { value: 'TBA', label: 'Time to first attributed order' },
      { value: 'TBA', label: 'Cost of acquisition vs Sales-led' },
    ],
    nextSteps: [
      'The creation of an AI Assistant that generates ready-to-implement recommendations and modifications to active features based on an analysis of the account, industry, and store specifications—rather than simply running a fixed set of basic functions. Furthermore, it prompts the user to take action, rather than waiting for the user to articulate their needs and issues.',
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts Activation',
    tagline: 'Turned a manual Support task into a zero-touch feature. 92% adoption, without a single line of onboarding copy explaining how it works.',
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      year: '2026',
    },
    coverImage: '/images/thumbnail3.jpg',
    thumbnailImage: '/images/thumbnail3.jpg',
    overview: 'In edrone, contacts must be identified — linked to browsing activity — before any automation can fire at scale. It was the single biggest bottleneck to user ROI, handled manually by Support one customer at a time. I designed and co-built a system that activates itself. Built the entire frontend in Codex.',
    overviewImage: '/images/identificationflow.jpg',
    opportunity: [
      'Amplitude and Support data showed this was the most requested onboarding action by far. Without identified contacts, automations fire at a fraction of their potential — and automations convert significantly higher than newsletters, so low identification directly capped what users could earn. This was a leverage point for the entire product\'s value.',
    ],
    decision: [
      'The obvious approach would have been to explain contact identification during onboarding. I did not do that.',
      'Instead, the feature activates automatically 3 days after account creation. The first identification email sends itself. Users do not need to understand how it works — they just start seeing results.',
      'The email itself was the hardest design challenge: infrastructure sent to the user\'s entire contact base every 30 days on their behalf. I needed users to understand what they were opting into without making it feel heavy. The solution: a visual treatment that merges automation and newsletter concepts into a single interface, intentionally distinct from the standard automation builder to avoid confusion.',
    ],
    decisionImage: '/images/identification.jpg',
    metrics: [
      { value: '+TBA%', label: 'Contact identification rate, first TBA days' },
      { value: '92%', label: 'Feature adoption rate' },
      { value: 'TBA', label: 'Revenue attributed to identified contacts with flow active' },
    ],
    nextSteps: [
      'Identification is crucial at the outset, but mainly for new users; for users who have been using Edrone for a longer period, reactivation and list cleaning are the most important, as these allow them to remove inactive contacts and thereby effectively reduce the cost of their subscription.',
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getProjectNavigation(slug: string): {
  prev: Project
  next: Project
} {
  const index = projects.findIndex((p) => p.slug === slug)
  const total = projects.length
  return {
    // Loop: if first project, prev is last; if last project, next is first
    prev: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total],
  }
}
