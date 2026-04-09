// ─── Process content block types ────────────────────────────────────────────

export interface ProcessStep {
  num: string
  title: string
  description: string
  imageSrc?: string   // undefined = placeholder
}

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'placeholder'; caption?: string }
  | { kind: 'steps'; items: ProcessStep[] }
  | { kind: 'compare'; before: string; after: string; caption?: string }

// ─── Project interface ───────────────────────────────────────────────────────

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
  opportunity: string[]
  opportunityExtra?: string[]   // shown after overviewDiagram
  processContent?: ProcessBlock[]
  // legacy fields (fallback if processContent not set)
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

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'freemium-activation',
    title: 'Freemium launch',
    tagline: 'From sales-gated to self-serve. 4,657 accounts in 10 months.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model that replaced it.",
    metrics: [
      { value: '8.4%', label: 'PAID CONVERSION', color: 'accent' },
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
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: 'Without identified contacts, automations fire at a fraction of their potential. Without a first attributed order, the value of the product stays invisible. The original flow started with integration: connect your ecommerce platform to edrone, then see what the product does. Users had to trust edrone before edrone gave them a reason to.',
      },
      {
        kind: 'text',
        content: "I reversed the sequence. Account creation first via email, Google, or Shopify. Then AI-generated content from the store's brand, including ready-to-send newsletters, automations, and pop-ups. Users see what the product can do for their store before connecting anything. Feature activation based on what they already see working. Integration comes last, after value is demonstrated.",
      },
      {
        kind: 'placeholder',
        caption: 'Original flow started with integration. The redesigned flow starts with value.',
      },
      {
        kind: 'heading',
        content: 'The full activation path has five steps:',
      },
      {
        kind: 'steps',
        items: [
          {
            num: '01',
            title: 'Create an account',
            description: 'Get started with email, Google, or Shopify. Account created immediately, no demo, no sales call.',
          },
          {
            num: '02',
            title: 'Create AI-powered branded content',
            description: "edrone reads the store's brand and generates ready-to-send newsletters, automations, and pop-ups. Users see what the product can do for their store before connecting anything.",
          },
          {
            num: '03',
            title: 'Activation',
            description: "Browse ready-to-use features. Users choose what to turn on based on what they've already seen, not based on instructions.",
          },
          {
            num: '04',
            title: 'Integration',
            description: "Connect the ecommerce platform to edrone. This step comes after users have already experienced the product's value, not before. This sequencing was the core design decision.",
          },
          {
            num: '05',
            title: 'AHA Moment',
            description: "Get your first order and see edrone's value. The moment an attributed order appears is when the upgrade decision becomes obvious.",
          },
        ],
      },
      {
        kind: 'text',
        content: 'The aha moment is the first attributed order appearing in the dashboard. That is when the upgrade decision becomes obvious. Free tier: 500 messages per month. Upgrade: two clicks via Stripe.',
      },
      {
        kind: 'text',
        content: 'One designer, five engineers. Built end-to-end in six months with zero prior self-serve infrastructure.',
      },
    ],
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
    title: 'Signup flow',
    tagline: 'One field removed. Two steps. Five hours from diagnosis to production.',
    description: 'One field removed. Two steps. Five hours from diagnosis to production.',
    metrics: [
      { value: '+67%', label: 'SIGNUP CONVERSION', color: 'accent' },
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
      'edrone is a marketing automation CRM for ecommerce. The platform had just launched its first self-serve freemium tier, but the signup form was still built for the sales-led era. Designed to qualify leads, not activate users. Amplitude funnels showed massive drop-off at the registration form. Mobile conversion sat at 0.05%.',
    ],
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: 'I had our Senior Product Data Analyst run a full audit of the signup flow. The data confirmed what I suspected: the phone number field was the primary drop-off point. A check with Sales confirmed they had not used it for qualification in months. Google SSO was also silently broken. The single-page layout could not handle the redirect, so the fastest signup path was failing with no error state.',
      },
      {
        kind: 'compare',
        before: '/images/signup-old.jpg',
        after: '/images/signup-new1.jpg',
        caption: 'Before: a single-page form built for lead qualification. After: two steps built for activation.',
      },
      {
        kind: 'text',
        content: 'I made one call: remove the field and restructure the form into two steps at the same time rather than running sequential A/B tests. Step 1 creates the account via email or Google SSO. Step 2 collects the store URL. This fixed SSO at a structural level rather than as a patch. Built in Codex, shipped after a single code review.',
      },
    ],
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
    title: 'Contacts identification',
    tagline: 'Turned a manual Support task into a zero-touch feature. 95% adoption.',
    description: 'Contact identification was the single biggest bottleneck to user ROI. Support was handling it manually, one customer at a time.',
    metrics: [
      { value: '+19%', label: 'IDENTIFICATION RATE', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      duration: '8 days',
      date: '2026',
    },
    coverImage: '/images/ci-cover.png',
    thumbnailImage: '/images/ci-cover.png',
    overview: '',
    overviewDiagram: {
      before: 'Unidentified\ncontact',
      action: 'Opens email',
      after: 'John Doe\nj.doe@mail.com',
      caption: 'Contacts are anonymous until they open an email. That action links them to their browsing activity and unlocks the full automation suite.',
    },
    opportunity: [
      "edrone is a marketing automation CRM for ecommerce. When a new user integrates their store, their full contact base gets imported into edrone. These contacts have emails and purchase history, but no linked cookies. At the same time, edrone can see anonymous activity on the store's website: someone is browsing products, adding to cart, making purchases. But it cannot connect that activity to a specific contact in the base. The data exists on both sides. Identification is what connects them.",
    ],
    opportunityExtra: [
      "This matters because of how automations work in edrone. Automations are emails triggered by customer behaviour on the store's website: browsing a product, adding to cart, completing a purchase. They account for roughly 45% of total revenue generated by edrone for a user and convert 9x better than newsletters. But they only fire for identified contacts. If a contact is not identified, edrone sees activity on the site but cannot match it to anyone, and no automation triggers.",
      "Without identification, users are left with newsletters as their only channel. Newsletters not only convert worse, they also require significantly more effort: creating content, designing layouts, deciding who to send to, setting frequency, repeating the whole process on a regular basis. Automations, once set up, run on their own. A user without identification is stuck on the highest-effort, lowest-return channel.",
      "Identification rate across the platform sat around 3%. Cookies clear over time and are per device, so a single customer on a phone and a laptop counts as two separate unidentified sessions. Identification is not a one-time event. It needs to happen continuously.",
      "Support had data showing that when they manually sent non-marketing emails to a customer's base, identification rates went up and churn went down. The method worked. But it was entirely manual. I decided to take this and build it into the onboarding flow as an automated feature. No competing product in the market offered anything like this or supported users with identification in any way.",
    ],
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: "Without this feature, the user would need to handle identification themselves: learn what it is, understand why it matters, decide what kind of emails to send, figure out the frequency, create the content. That is a lot of knowledge and effort for someone who is often encountering marketing automation for the first time and is already absorbing a dense onboarding flow.",
      },
      {
        kind: 'text',
        content: "I designed a dedicated step in the onboarding flow that handles all of this automatically. Identification sits as the fourth screen, after automations, popups, and social proof, right before integration. The full onboarding takes about five minutes. By the time users reach identification, they already have context for what edrone does.",
      },
      {
        kind: 'image',
        src: '/images/ci-dashboard.png',
        caption: 'I designed the identification screen as a transparent view into the full sequence. Users can click into each email to explore details, but nothing requires action.',
      },
      {
        kind: 'text',
        content: "The core design decision: the sequence is on by default. It activates automatically after integration. Users can turn it off, but they don't need to do anything to turn it on. This is opt-out, not opt-in. 95% adoption is a direct result of this choice. This reflected my broader vision for the product: features should work automatically with zero user fatigue. The user's job is to understand the value, not to operate the machinery.",
      },
      {
        kind: 'text',
        content: "The challenge was how to present a difficult concept in a simple way. Most users assume automations just work after setup. They have no reason to think about identification or understand that only ~3% of their base is reachable by automations at any given time. The screen needed to communicate the value clearly enough that users don't turn it off, while fitting naturally into an onboarding flow already dense with new information. The solution shows the full sequence transparently: users can click on each element and inspect the emails and their details, but everything runs without intervention.",
      },
      {
        kind: 'text',
        content: "The identification sequence has six emails, each different, all with non-marketing content so they can be sent to contacts without explicit marketing consent. Each email also signals to contacts that the store now communicates through edrone. I designed the email template structure and layout; AI generates the banners and copy based on each store's branding, so they look polished and unique from day one.",
      },
      {
        kind: 'image',
        src: '/images/ci-email.png',
        caption: 'One of six identification emails. I designed the template structure; AI generates banners and copy from store branding.',
      },
      {
        kind: 'text',
        content: 'The sequence starts 24 hours after integration. This gives time for the contact base to fully import and for the user to explore the product before emails go out.',
      },
      {
        kind: 'text',
        content: 'I designed the identification screen, the sequence flow, the email template structure, and the timing logic. Built the entire frontend in Codex; backend dev handled the sending mechanism. One Support person consulted throughout. Shipped in about a week and a half.',
      },
    ],
    results: {
      headline: '95% feature adoption. +19% identification rate globally. +32% for new users.',
      metrics: [
        { value: '95%', label: 'FEATURE ADOPTION RATE', sublabel: 'OPT-OUT DESIGN', color: 'accent' },
        { value: '+19%', label: 'TOTAL IDENTIFICATION', sublabel: '3.1% → 3.7%', color: 'accent' },
        { value: '+32%', label: 'NEW USERS IDENTIFICATION', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Reactivation module',
        description: 'I designed a reactivation module as the second step after identification. It targets contacts who stop opening emails: after a period of inactivity (varying by industry), they enter a reactivation sequence and eventually get removed from the base, reducing sending costs and protecting deliverability. I built the frontend in Codex but left edrone before the feature shipped.',
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
