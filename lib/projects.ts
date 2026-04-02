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
    duration: string
    date: string
  }
  coverImage: string
  thumbnailImage: string
  overview: string
  overviewDiagram?: {
    before: string
    action: string
    after: string
    caption: string
  }
  opportunityHeadline?: string
  opportunity: string[]
  opportunityFooter?: string
  solutionHeadline?: string
  solution: string[]
  hasCompareSlider?: boolean
  compareSliderImages?: {
    before: string
    after: string
  }
  solutionImages?: string[]
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
      duration: '8 months',
      date: '2025-2026',
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
    solutionHeadline: 'The hardest problem was not the paywall. It was activation: getting users to experience real value before they had a reason to trust the product.',
    solution: [
      'The original flow required platform integration before users could enter edrone. I reversed it: users first see what would activate after they connected, then chose whether to integrate. Integration rate fell slightly. Activated users rose. Business impact improved because the users who connected actually stayed and used the product.',
      'The free tier was capped at 500 messages per month. Enough for a small store to see measurable ROI, but not enough to stay free forever if the product worked. Upgrading took two clicks via Stripe.',
    ],
    solutionImages: ['/images/freemium-hero.png'],
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
    title: 'Signup Redesign',
    tagline: 'One field removed. Two steps. Five hours from diagnosis to production.',
    description: "Amplitude showed the drop-off. One field removed, form split in two steps, shipped in 5 hours. Results confirmed within 7 days.",
    metrics: [
      { value: '+100%', label: 'Desktop', color: 'accent' },
      { value: '+5900%', label: 'Mobile', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end',
      duration: '5h',
      date: '2026',
    },
    coverImage: '/images/thumbnail1.png',
    thumbnailImage: '/images/thumbnail1.png',
    overview: "Amplitude showed where users were dropping off on the signup form. Once the data confirmed the cause, the fix was clear. Removing one field and restructuring the form into two steps doubled desktop conversion and took mobile from near-zero to 3% within the first seven days.",
    opportunityHeadline: 'The signup form was inherited from the sales-led era, built for lead qualification rather than user activation.',
    opportunity: [
      'The phone number field was the primary drop-off point, confirmed by Amplitude event data.',
      'A check with Sales confirmed the field had not been used for lead qualification in months.',
      'Google SSO was silently failing with no error state visible to users.',
      'Mobile conversion from website to account: 0.05%.',
    ],
    opportunityFooter: 'The field was simply still there. The SSO was simply still broken.',
    solutionHeadline: 'The textbook answer would have been to run an A/B test on the phone field, then a separate test on the form structure. Six weeks, conclusive data, low risk.',
    solution: [
      'I made one call: remove the field and restructure the form into two steps at the same time. Step 1 creates the account immediately via email or Google SSO. Step 2 collects the store name and URL. This structure fixed the SSO redirect at a structural level.',
      'The solution was built in Codex and shipped after a single code review.',
    ],
    hasCompareSlider: true,
    compareSliderImages: {
      before: '/images/signup-old.jpg',
      after: '/images/signup-new1.jpg',
    },
    results: {
      headline: 'Diagnosed, designed, and shipped in 5 hours.',
      subheadline: 'Results confirmed within 7 days.',
      metrics: [
        { value: '+100%', label: 'DESKTOP SIGNUP CONVERSION', color: 'accent' },
        { value: '+5900%', label: 'MOBILE SIGNUP CONVERSION', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Cut account creation time',
        description: 'Store URL validation runs synchronously and can take up to 30 seconds. Parallelising or deferring it targets abandonment at the final step, where intent is highest.',
      },
      {
        title: 'Make Step 2 feel like value, not a form',
        description: 'The store URL enables personalised, branded communication from day one — users do not know this when they type it. Surfacing the benefit in context targets completion rate and first-session engagement.',
      },
      {
        title: 'Eliminate the form entirely for marketplace users',
        description: 'Users arriving from Shopify or Shoper represent the highest-intent segment. Platform-authenticated account creation via OAuth targets their drop-off to zero.',
      },
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts Activation',
    tagline: 'Turned a manual Support task into a zero-touch feature. 92% adoption, without a single line of onboarding copy.',
    description: 'Turned the biggest bottleneck to user ROI into a feature that activates itself. No onboarding copy. No support ticket. Just results.',
    metrics: [
      { value: '95%', label: 'Adoption', color: 'accent' },
      { value: '+19%', label: 'Identification', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      duration: '8 days',
      date: '2026',
    },
    coverImage: '/images/thumbnail3.png',
    thumbnailImage: '/images/thumbnail3.png',
    overview: 'In edrone, contacts must be identified — linked to browsing activity — before any automation can fire at scale. It was the single biggest bottleneck to user ROI, handled manually by Support one customer at a time. I designed and co-built the solution using Codex, automating what used to require human intervention entirely.',
    overviewDiagram: {
      before: 'Unidentified contact',
      action: 'Opens email',
      after: 'John Doe\nj.doe@mail.com',
      caption: 'Imported contacts are initially unidentified. They become identified only after opening an email, which triggers a tracking pixel. This lets edrone recognize them on the store\'s website and send automated messages that convert 10x better than newsletters.',
    },
    opportunityHeadline: 'Support was setting up identification emails for every new customer, their most requested onboarding task by far.',
    opportunity: [
      'Without identified contacts, automations fire at a fraction of their potential.',
      'Automations convert significantly higher than newsletters, so low identification directly capped what users could earn from the product.',
      'This was not just a UX opportunity. It was a leverage point for the entire product\'s value.',
    ],
    solutionHeadline: 'The obvious approach would have been to explain contact identification during onboarding: walk the user through tracking pixels, newsletter signups, and purchase flows.',
    solution: [
      'I did not do that.',
      'Instead, the feature activates automatically 3 days after account creation. The first identification email sends itself. Users do not need to understand how it works — they just start seeing results.',
      'The email itself was the hardest design challenge: it is not a marketing email, it is infrastructure. It goes to the user\'s entire contact base every 30 days on their behalf.',
      'I needed users to understand what they were opting into without making it feel heavy or technical. The solution was a visual treatment that merges the automation and newsletter concepts into a single, obvious interface, intentionally distinct from the standard automation builder to avoid confusion. I built the entire frontend in Codex; the backend dev handled the sending mechanism.',
    ],
    solutionImages: ['/images/contacts-dashboard.png', '/images/contacts-modal.png'],
    results: {
      headline: 'Turned a manual Support task into infrastructure that runs itself.',
      metrics: [
        { value: '+19%', label: 'TOTAL IDENTIFICATION', color: 'accent' },
        { value: '+32%', label: 'NEW USERS IDENTIFICATION', color: 'accent' },
        { value: '95%', label: 'FEATURE ADOPTION RATE', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Identification is most critical at the start, but reactivation matters more over time',
        description: 'For users who have been on edrone longer, list cleaning becomes the priority — removing inactive contacts reduces subscription cost and improves deliverability. The feature should evolve to address both lifecycle stages.',
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
