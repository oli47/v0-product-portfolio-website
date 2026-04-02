export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  metrics: {
    value: string
    label: string
    color?: 'accent' | 'ink'
  }[]
  meta: {
    role: string
    team: string
    tools?: string
    timeline: string
  }
  coverImage: string
  thumbnailImage: string
  overview: string
  opportunity: string[]
  solution: string[]
  solutionCallout?: string
  solutionImage?: string
  results: {
    headline: string
    subheadline?: string
    northStar?: {
      label: string
      tag?: string
      value: string
      sublabel?: string
    }
    metrics: {
      value: string
      label: string
      sublabel?: string
      color?: 'accent' | 'ink'
    }[]
  }
  nextSteps: {
    title: string
    description: string
  }[]
}

export const projects: Project[] = [
  {
    slug: 'freemium-activation',
    title: 'Freemium Activation',
    tagline: 'From sales call to self-serve. 4,600 accounts in 10 months.',
    description: "Rebuilt edrone's entire acquisition model. Turned a sales-gated platform into a scalable self-serve engine — signup, onboarding, integration, activation, Stripe.",
    metrics: [
      { value: '+5000', label: 'Users', color: 'accent' },
      { value: '78%', label: 'Activation rate', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '3 Front-end, 2 Back-end',
      timeline: '8 months',
    },
    coverImage: '/images/thumbnail2.png',
    thumbnailImage: '/images/thumbnail2.png',
    overview: "edrone had no way for a new user to try the product without going through Sales first. I designed and built the entire acquisition path: signup, onboarding, integration flow, feature activation, and Stripe paywall. In 10 months the model acquired 4657 freemium accounts and cut the median time to first order driven by edrone from 44 to 5 days.",
    opportunity: [
      'The data made the case clearly before any design work started.',
      'The product had no signup flow, no free tier, no onboarding, no paywall.',
      'Every account required a human in the loop.',
      'Amplitude showed consistent inbound traffic bouncing before reaching Sales.',
      'Website to created account: 0.17% overall, mobile at 0.01%.',
      'Users wanted to try the product. There was nowhere to try it.',
    ],
    solution: [
      'The original flow required platform integration before users could enter edrone. I reversed it: users first see what would activate after they connected, then chose whether to integrate. Integration rate fell slightly. Activated users rose. Business impact improved because the users who connected actually stayed and used the product.',
      'The free tier was capped at 500 messages per month. Enough for a small store to see measurable ROI, but not enough to stay free forever if the product worked. Upgrading took two clicks via Stripe.',
    ],
    solutionCallout: 'The hardest problem was not the paywall. It was activation: getting users to experience real value before they had a reason to trust the product.',
    solutionImage: '/images/freemium-hero.png',
    results: {
      headline: '10 months. One designer, five engineers,',
      subheadline: 'zero prior self-serve infrastructure.',
      northStar: {
        label: 'MEDIAN DAYS TO FIRST ATTRIBUTED ORDER',
        tag: 'NORTH STAR',
        value: '9x faster',
        sublabel: 'FROM 44 TO 5 DAYS',
      },
      metrics: [
        { value: '4657', label: 'NEW USERS', color: 'accent' },
        { value: '8.4%', label: 'CONVERTED TO PAID', color: 'accent' },
        { value: '44% → 80%', label: 'USERS WITH ACTIVE AUTOMATIONS', color: 'accent' },
        { value: '20x lower', label: 'CAC VS SALES-LED', color: 'ink' },
      ],
    },
    nextSteps: [
      {
        title: 'Replace the fixed onboarding sequence with a context-aware one',
        description: 'Every store currently goes through the same flow regardless of size, industry, or integration status. The metric to move: activation rate and time to first attributed order — both plateau when onboarding is not relevant to the user\'s context.',
      },
      {
        title: 'Zero-friction signup for marketplace users',
        description: 'Users arriving from Shopify, Shoper, or Tiendanube represent the highest-intent cohort and currently still hit the full signup form. Auto-creating accounts via OAuth targets the drop-off between marketplace click and account creation.',
      },
      {
        title: 'Surface the upgrade prompt at a moment of demonstrated value',
        description: 'The current paywall triggers when users hit the message limit, which often feels like a penalty. Moving the prompt to the moment a user first sees revenue attributed to edrone targets upgrade conversion rate at peak motivation.',
      },
    ],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup Flow',
    tagline: 'Amplitude showed the drop-off. One field removed, form split in two steps, shipped in 5 hours. Results confirmed within 7 days.',
    description: "Amplitude showed the drop-off. One field removed, form split in two steps, shipped in 5 hours. Results confirmed within 7 days.",
    metrics: [
      { value: '+40%', label: 'Desktop', color: 'accent' },
      { value: '+300%', label: 'Mobile', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end developer',
      timeline: '5 hours',
    },
    coverImage: '/images/thumbnail1.png',
    thumbnailImage: '/images/thumbnail1.png',
    overview: "edrone's signup was the entry point into a freemium e-commerce platform. Amplitude showed massive drop-off at the form. I found the cause, designed the fix, coded it using Codex, and shipped it the same day. Total time: under 5 hours.",
    opportunity: [
      'The phone number field was the top drop-off point, confirmed by Amplitude event data, a UX audit, and competitive benchmarks. A quick check with Sales confirmed they no longer needed it for qualification. The field was just still there.',
      'On top of that, Google SSO was broken because the single-page layout could not handle the redirect flow properly — a fast and trusted signup method was silently failing.',
    ],
    solution: [
      'I could have run two separate A/B tests over 6 weeks. Instead, I made one call: remove the phone field and split the form into two steps at once. Step 1: Email or Google SSO, account created immediately. Step 2: Name and store URL. This fixed the SSO flow structurally and eliminated the biggest friction point in one move.',
      'Built the entire solution in Codex, shipped after a light code review with one front-end dev.',
    ],
    results: {
      headline: 'Results confirmed in first 7 days.',
      metrics: [
        { value: '+40%', label: 'SIGNUP RATE, DESKTOP', color: 'accent' },
        { value: '+300%', label: 'SIGNUP RATE, MOBILE', color: 'accent' },
        { value: '+50%', label: 'INTEGRATION RATE', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Reduce account creation time',
        description: 'Creating an account takes up to 30 seconds, causing users to abandon the process.',
      },
      {
        title: 'Show the value of store URL entry',
        description: 'By entering the store\'s URL, we create personalized and branded communication for the store, but the user is unaware of this.',
      },
      {
        title: 'Auto-create accounts via marketplace OAuth',
        description: 'Users coming from e-commerce marketplaces could have their accounts automatically created through authentication by those platforms.',
      },
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts Activation',
    tagline: 'Turned the biggest bottleneck to user ROI into a feature that activates itself. No onboarding copy. No support ticket. Just results.',
    description: 'Turned the biggest bottleneck to user ROI into a feature that activates itself. No onboarding copy. No support ticket. Just results.',
    metrics: [
      { value: '92%', label: 'Adoption', color: 'accent' },
      { value: '+14%', label: 'Identification', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      timeline: '3 weeks',
    },
    coverImage: '/images/thumbnail3.png',
    thumbnailImage: '/images/thumbnail3.png',
    overview: 'In edrone, contacts must be identified — linked to browsing activity — before any automation can fire at scale. It was the single biggest bottleneck to user ROI, handled manually by Support one customer at a time. I designed and co-built a system that activates itself. Built the entire frontend in Codex.',
    opportunity: [
      'Amplitude and Support data showed this was the most requested onboarding action by far. Without identified contacts, automations fire at a fraction of their potential — and automations convert significantly higher than newsletters, so low identification directly capped what users could earn. This was a leverage point for the entire product\'s value.',
    ],
    solution: [
      'The obvious approach would have been to explain contact identification during onboarding. I did not do that.',
      'Instead, the feature activates automatically 3 days after account creation. The first identification email sends itself. Users do not need to understand how it works — they just start seeing results.',
      'The email itself was the hardest design challenge: infrastructure sent to the user\'s entire contact base every 30 days on their behalf. I needed users to understand what they were opting into without making it feel heavy. The solution: a visual treatment that merges automation and newsletter concepts into a single interface, intentionally distinct from the standard automation builder to avoid confusion.',
    ],
    results: {
      headline: 'Results within 6 days of launch.',
      metrics: [
        { value: '+14%', label: 'CONTACT IDENTIFICATION RATE', color: 'accent' },
        { value: '92%', label: 'FEATURE ADOPTION RATE', color: 'accent' },
        { value: 'TBA', label: 'REVENUE ATTRIBUTED TO IDENTIFIED CONTACTS', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Add reactivation and list cleaning for existing users',
        description: 'Identification is crucial at the outset, but mainly for new users. For established users, reactivation and list cleaning allow them to remove inactive contacts and reduce subscription costs.',
      },
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
    prev: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total],
  }
}
