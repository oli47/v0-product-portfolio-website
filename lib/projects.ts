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
    tagline: 'From sales-gated to self-serve. 4,657 accounts in 10 months.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model that replaced it.",
    metrics: [
      { value: '4,657', label: 'NEW USERS', color: 'accent' },
      { value: '9x faster', label: 'TIME TO VALUE', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '3 Front-end, 2 Back-end',
      duration: '8 months',
      date: '2025-2026',
    },
    coverImage: '/thumbnails/freemium-activation.png',
    thumbnailImage: '/thumbnails/freemium-activation.png',
    overview: '',
    opportunity: [
      'edrone is a marketing automation CRM for ecommerce. The platform had no way for a new user to try the product without going through Sales. Every account required a demo, a proposal, a handoff to Support. Amplitude showed consistent inbound traffic bouncing before reaching Sales. Website conversion sat at 0.05%. Users were arriving and leaving without ever seeing the product.',
    ],
    solution: [
      'Without identified contacts, automations fire at a fraction of their potential. Without a first attributed order, the value of the product stays invisible. The original flow started with integration — connect your ecommerce platform to edrone, then see what the product does. Users had to trust edrone before edrone gave them a reason to.',
      'I reversed the sequence. Account creation first via email, Google, or Shopify. Then AI-generated content from the store\'s brand — ready-to-send newsletters, automations, and pop-ups. Users see what the product can do for their store before connecting anything. Feature activation based on what they already see working. Integration comes last, after value is demonstrated.',
      'The aha moment is the first attributed order appearing in the dashboard. That is when the upgrade decision becomes obvious. Free tier: 500 messages per month. Upgrade: two clicks via Stripe.',
      'One designer, five engineers. Built end-to-end in six months with zero prior self-serve infrastructure.',
    ],
    solutionImages: ['/images/freemium-hero.png'],
    results: {
      headline: '4,657 freemium accounts in 10 months. 78% activation rate.',
      subheadline: '9x faster time to first attributed order. CAC reduced 20x vs the previous sales-led model.',
      northStar: {
        label: 'MEDIAN DAYS TO FIRST ATTRIBUTED ORDER',
        tag: 'NORTH STAR',
        value: '9x faster',
        sublabel: 'FROM 44 TO 5 DAYS',
      },
      metrics: [
        { value: '4,657', label: 'FREEMIUM ACCOUNTS', color: 'accent' },
        { value: '78%', label: 'ACTIVATION RATE', color: 'accent' },
        { value: '8.4%', label: 'CONVERTED TO PAID', color: 'accent' },
        { value: '20x lower', label: 'CAC VS SALES-LED', color: 'ink' },
      ],
    },
    nextSteps: [
      {
        title: 'AI-driven onboarding',
        description: 'The current flow runs the same sequence for every store. A context-aware assistant reading store type and account history could generate personalised activation paths.',
      },
      {
        title: 'Platform OAuth for marketplace users',
        description: 'Auto-creating accounts for Shopify and Shoper users would reduce their friction to zero.',
      },
      {
        title: 'Upgrade at moments of value',
        description: 'Surfacing the paywall when a user first sees revenue attributed to edrone, not at a message limit.',
      },
    ],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup Redesign',
    tagline: 'One field removed. Two steps. Five hours from diagnosis to production.',
    description: 'One field removed. Two steps. Five hours from diagnosis to production.',
    metrics: [
      { value: '+67%', label: 'SIGNUP CONVERSION', color: 'accent' },
      { value: '0.05% → 3%', label: 'MOBILE', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Front-end',
      duration: '5h',
      date: '2026',
    },
    coverImage: '/thumbnails/signup-redesign.png',
    thumbnailImage: '/thumbnails/signup-redesign.png',
    overview: '',
    opportunity: [
      'edrone is a marketing automation CRM for ecommerce. The platform had just launched its first self-serve freemium tier, but the signup form was still built for the sales-led era — designed to qualify leads, not activate users. Amplitude funnels showed massive drop-off at the registration form. Mobile conversion sat at 0.05%.',
    ],
    solution: [
      'I had our Senior Product Data Analyst run a full audit of the signup flow. The data confirmed what I suspected: the phone number field was the primary drop-off point. A check with Sales confirmed they had not used it for qualification in months. Google SSO was also silently broken — the single-page layout could not handle the redirect, so the fastest signup path was failing with no error state.',
      'I made one call: remove the field and restructure the form into two steps at the same time rather than running sequential A/B tests. Step 1 creates the account via email or Google SSO. Step 2 collects the store URL. This fixed SSO at a structural level rather than as a patch. Built in Codex, shipped after a single code review.',
    ],
    hasCompareSlider: true,
    compareSliderImages: {
      before: '/images/signup-old.jpg',
      after: '/images/signup-new1.jpg',
    },
    results: {
      headline: '+67% total signup conversion. Desktop doubled. Mobile went from 0.05% to 3%.',
      subheadline: 'Results confirmed within 7 days.',
      metrics: [
        { value: '×2', label: 'DESKTOP SIGNUP CONVERSION', color: 'accent' },
        { value: '0.05% → 3%', label: 'MOBILE SIGNUP CONVERSION', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Parallelise store URL validation',
        description: 'Store URL validation runs synchronously and can take 30 seconds. Parallelising it targets abandonment at the final step, where intent is highest.',
      },
      {
        title: 'Platform OAuth for marketplace users',
        description: 'Users arriving from Shopify or Shoper could skip the form entirely via platform OAuth.',
      },
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts Activation',
    tagline: 'Turned a manual Support task into a zero-touch feature. 95% adoption.',
    description: 'Contact identification was the single biggest bottleneck to user ROI. Support was handling it manually, one customer at a time.',
    metrics: [
      { value: '95%', label: 'ADOPTION', color: 'accent' },
      { value: '+19%', label: 'IDENTIFICATION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      duration: '8 days',
      date: '2026',
    },
    coverImage: '/thumbnails/contacts-activation.png',
    thumbnailImage: '/thumbnails/contacts-activation.png',
    overview: '',
    overviewDiagram: {
      before: 'Unidentified\ncontact',
      action: 'Opens email',
      after: 'John Doe\nj.doe@mail.com',
      caption: 'Imported contacts are initially unidentified. They become identified only after opening an email, which triggers a tracking pixel. This lets edrone recognize them on the store\'s website and send automated messages that convert 10x better than newsletters.',
    },
    opportunity: [
      'edrone is a marketing automation CRM for ecommerce. Contacts in edrone start anonymous — they become identified only after opening an email, which fires a tracking pixel and links them to their browsing activity. Without identified contacts, automations run at a fraction of their potential. Setting this up was the most requested Support task for every new customer, handled manually, one account at a time. Zero scalability.',
    ],
    solution: [
      'The obvious approach would have been to explain identification during onboarding — walk users through tracking pixels and newsletter mechanics. I skipped that. Instead I designed a dedicated screen that explains what identification is, why it matters, and activates it automatically 3 days after account creation. The first identification email sends itself. Users do not need to understand the infrastructure — they see results.',
      'The hardest part was the email itself: infrastructure sent to the user\'s entire contact base every 30 days on their behalf. I needed it to feel lightweight, not heavy. The solution was a visual treatment that merges the automation and newsletter concepts into a single interface, intentionally distinct from the standard automation builder. Built the entire frontend in Codex; backend dev handled the sending mechanism. One Support person consulted throughout. Shipped in about a week and a half.',
    ],
    solutionImages: ['/images/contacts-dashboard-1.png', '/images/contacts-dashboard-2.png'],
    results: {
      headline: '95% feature adoption. Identification rate went from 3.1% to 3.7% globally (+19%), and 4.1% for accounts onboarded after launch.',
      metrics: [
        { value: '+19%', label: 'TOTAL IDENTIFICATION RATE', color: 'accent' },
        { value: '4.1%', label: 'NEW ACCOUNTS IDENTIFICATION', color: 'accent' },
        { value: '95%', label: 'FEATURE ADOPTION', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'List cleaning for longer-tenured users',
        description: 'Identification matters most at the start, but reactivation matters more over time. For longer-tenured users, list cleaning becomes the priority — removing inactive contacts reduces subscription cost and improves deliverability. I started designing a reactivation module before leaving edrone.',
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
