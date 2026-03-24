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
    title: 'Signup Redesign',
    tagline: '+40% signups on desktop, +300% on mobile within 7 days.',
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end developer',
      year: '2026',
    },
    coverImage: '/images/thumbnail1.jpg',
    thumbnailImage: '/images/thumbnail1.jpg',
    overview: "edrone's signup was the entry point into a freemium e-commerce platform. I spotted a critical drop-off, designed the fix, coded it myself using AI, and shipped it the same day. Total time: under 5 hours.",
    opportunity: [
      'Amplitude data showed massive abandonment at the signup form. Two compounding issues were hiding in plain sight. The phone number field was the top drop-off point, confirmed by event data, a UX audit, and competitive benchmarks. A quick check with Sales confirmed they no longer needed phone numbers for lead qualification. The field was just still there.',
      'On top of that, Google SSO was broken because the single-page layout could not handle the redirect flow properly, so a fast and trusted signup method was silently failing. Two friction points, one root cause: a form that had not been questioned in years.',
    ],
    decision: [
      'I could have run two separate A/B tests over 6 weeks. Instead, I made one call: remove the phone field and split the form into two steps at once. Step 1: Email or Google SSO, account created immediately. Step 2: Name and store URL. This fixed the SSO flow structurally and eliminated the biggest friction point in one move.',
      'I built the entire solution myself using Codex, going from design to working code without waiting on dev resources, then shipped after a light code review with one front-end dev.',
    ],
    metrics: [
      { value: '+40%', label: 'Signup rate desktop · 7 days' },
      { value: '+300%', label: 'Signup rate mobile · 7 days' },
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
    tagline: 'Self-serve path from scratch, turning a sales-gated product into a scalable growth engine.',
    meta: {
      role: 'Sr Product Designer',
      team: '3 Front-end, 2 Back-end developers',
      year: '2025-2026',
    },
    coverImage: '/images/thumbnail2.jpg',
    thumbnailImage: '/images/thumbnail2.jpg',
    overview: 'Before freemium, every new edrone customer required a Sales call, manual onboarding, and hand-holding from Support. I proposed the freemium model, owned the full design from signup through onboarding, integration, feature activation, and Stripe payment, and shipped it end-to-end.',
    overviewImage: '/images/activationflow.jpg',
    opportunity: [
      "edrone's growth had a hard ceiling: Sales. Every new user was expensive to acquire and slow to activate. The product was genuinely useful, users just never had a chance to find that out on their own. The opportunity was to let the product sell itself.",
    ],
    decision: [
      'The hardest problem was not the paywall. It was activation: getting users to experience real value before they had a reason to trust the product. Two decisions changed the outcome.',
      'First, the free tier was capped at 500 messages per month. Enough for a small store to see measurable ROI, but not enough to stay free forever if the product worked. Upgrading took two clicks via Stripe.',
      'Second, the activation flow was reversed. Originally, platform integration was a hard gate before users could enter edrone. I flipped it: users first saw what would activate after they connected, then chose whether to integrate. Integration rate fell. Activated users rose. Business impact improved because the users who integrated actually used the product.',
      'Sometimes the metric you optimize is not the one you started measuring.',
    ],
    decisionImage: '/images/activationwidget.jpg',
    metrics: [
      { value: 'TBA', label: 'Created accounts' },
      { value: 'TBA', label: 'Time to integration' },
      { value: 'TBA', label: 'Time to attributed order' },
    ],
    nextSteps: [
      'The creation of an AI Assistant that generates ready-to-implement recommendations and modifications to active features based on an analysis of the account, industry, and store specifications—rather than simply running a fixed set of basic functions. Furthermore, it prompts the user to take action, rather than waiting for the user to articulate their needs and issues.',
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts Activation',
    tagline: 'Turned a manual Support task into a zero-touch feature with 92% adoption.',
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      year: '2026',
    },
    coverImage: '/images/thumbnail3.jpg',
    thumbnailImage: '/images/thumbnail3.jpg',
    overview: 'In edrone, contacts must be identified, linked to browsing activity, before any automation or personalization can fire at scale. It was the single biggest bottleneck to user ROI, handled manually by Support one customer at a time. I designed and co-built the solution using Codex, automating what used to require human intervention entirely.',
    overviewImage: '/images/identificationflow.jpg',
    opportunity: [
      'Support was setting up identification emails for every new customer, their most requested onboarding task by far. Without identified contacts, automations fire at a fraction of their potential, and since automations convert significantly higher than newsletters, low identification directly capped what users could earn from the product. This was not just a UX opportunity. It was a leverage point for the entire product\'s value.',
    ],
    decision: [
      'The obvious approach would have been to explain contact identification during onboarding: walk the user through tracking pixels, newsletter signups, and purchase flows.',
      'I did not do that.',
      'Instead, the feature activates automatically 3 days after account creation. The first identification email sends itself. Users do not need to understand how it works, they just start seeing results. The email itself was the hardest design challenge: it is not a marketing email, it is infrastructure. It goes to the user\'s entire contact base every 30 days on their behalf.',
      'I needed users to understand what they were opting into without making it feel heavy or technical. The solution was a visual treatment that merges the automation and newsletter concepts into a single, obvious interface, intentionally distinct from the standard automation builder to avoid confusion. I built the entire frontend in Codex, the backend dev handled the sending mechanism.',
    ],
    decisionImage: '/images/identification.jpg',
    metrics: [
      { value: '+14%', label: 'Contact identification rate in 6 days' },
      { value: '92%', label: 'Feature adoption rate' },
      { value: 'TBA', label: 'Revenue attributed to identified contacts' },
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
