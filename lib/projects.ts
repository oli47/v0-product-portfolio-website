// ─── Process content block types ────────────────────────────────────────────

export interface ProcessStep {
  num: string
  title: string
  description: string
  imageSrc?: string   // undefined = placeholder
}

export type CompareImage = { src: string; label: string }

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'placeholder'; caption?: string }
  | { kind: 'steps'; items: ProcessStep[] }
  | { kind: 'compare'; images: CompareImage[]; caption?: string }

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
  opportunityExtra?: string[]       // shown after overviewDiagram
  opportunityBlocks?: ProcessBlock[] // rich opportunity content (replaces above when set)
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
    note?: string
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
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model I built alongside it.",
    metrics: [
      { value: '8.4%', label: 'PAID CONVERSION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1–5 Engineers',
      duration: '6 months',
      date: '2024–2025',
    },
    coverImage: '/thumbnails/freemium-activation.png',
    thumbnailImage: '/thumbnails/freemium-activation.png',
    overview: '',
    opportunity: [],
    opportunityBlocks: [
      {
        kind: 'text',
        content: 'edrone is a marketing automation CRM for ecommerce. When I joined, the product was built to be operated by Support. There was no path for a user to sign up or activate it independently. Over 2.5 years I redesigned the product toward self-serve. That made a freemium model possible.',
      },
      {
        kind: 'text',
        content: 'The previous model was entirely sales-led. Customers signed without ever seeing the product, then waited for Support to onboard them.',
      },
      {
        kind: 'placeholder',
        caption: 'Before: weeks from first contact to active account. After: minutes.',
      },
      {
        kind: 'text',
        content: 'Self-serve was already a standard in the category. Sales-led acquisition does not scale the same way, and a freemium path would open a new channel alongside the existing one.',
      },
    ],
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: 'The core decision was the sequence. The initial freemium version still started with integration: connect your store, then see the product. Users had to trust edrone before edrone gave them a reason to. I reversed it. Show value first, ask for commitment last.',
      },
      {
        kind: 'placeholder',
        caption: 'The full activation path. Value demonstrated before any commitment.',
      },
      {
        kind: 'text',
        content: 'Users create an account, AI generates branded content from their store URL (newsletters, automations, pop-ups), the activation widget walks them through what is pre-configured, and integration comes last. Everything is on by default. The user reviews what is ready, not builds from scratch.',
      },
      {
        kind: 'text',
        content: 'Three decisions shaped the model:',
      },
      {
        kind: 'text',
        content: '**Free tier at 500 messages.** The business wanted 200. I calculated that users send roughly 7–8% of messages through automations in the first 30 days. Combined with the first AI-generated newsletter (free of limits) and identification sequences, 500 messages gave even the smallest stores enough volume to reach at least one attributed order. That order is the aha moment: real revenue, driven by edrone. Not a promise of value, but proof of it.',
      },
      {
        kind: 'text',
        content: '**AI-generated content instead of templates.** Every competing tool gives users empty templates to customise. I wanted zero fatigue: user arrives, sees ready-to-go content personalised to their store, and activates with a click. No learning curve, no building, no decisions about what to create.',
      },
      {
        kind: 'text',
        content: '**Integration last.** Connecting a store to a third-party tool means sharing contacts, products, and store data. That is a trust decision. By the time users reach integration, they already know what edrone does and what it will do with their data.',
      },
      {
        kind: 'text',
        content: 'The signup flow and contacts identification later became their own projects as the funnel matured.',
      },
      {
        kind: 'text',
        content: 'Built end-to-end over six months with 1–5 engineers (the team scaled during the project). No prior self-serve infrastructure existed.',
      },
    ],
    results: {
      headline: '4,657 freemium accounts in 10 months. 78% activation rate.',
      northStar: {
        label: 'MEDIAN DAYS TO FIRST ATTRIBUTED ORDER',
        tag: 'NORTH STAR',
        value: '9x faster',
        sublabel: 'FROM 44 TO 5 DAYS',
      },
      metrics: [
        { value: '4,657', label: 'FREEMIUM ACCOUNTS', color: 'accent' },
        { value: '78%', label: 'ACTIVATION RATE', color: 'accent' },
        { value: '8.4%', label: 'FREE-TO-PAID CONVERSION', color: 'accent' },
        { value: '20x lower', label: 'CAC VS SALES-LED', color: 'ink' },
        { value: '13 → 1 day', label: 'MEDIAN DAYS TO FIRST NEWSLETTER', color: 'ink' },
      ],
    },
    nextSteps: [
      {
        title: 'Personalised onboarding',
        description: 'The current flow runs the same sequence for every store. A context-aware AI assistant reading store type, industry, and account history could generate different activation paths for different businesses.',
      },
      {
        title: 'Platform OAuth',
        description: 'Users from Shopify or Shoper could skip signup entirely, reducing friction for the highest-intent segment to zero.',
      },
      {
        title: 'Value-based upgrade',
        description: 'The upgrade currently triggers at the message limit. Surfacing it when a user first sees revenue attributed to edrone would feel like a next step, not a gate.',
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
    coverImage: '/images/sf-cover.png',
    thumbnailImage: '/images/sf-cover.png',
    overview: '',
    opportunity: [],
    opportunityBlocks: [
      {
        kind: 'text',
        content: 'edrone is a marketing automation CRM for ecommerce. The platform had just launched a self-serve freemium tier, but the signup form was still built for the sales-led era: four fields on a single page, broken SSO, a phone number field with no function in the product. Amplitude and a Claude-powered UX agent I had built both flagged signup as the top-priority drop-off. Mobile conversion sat at 0.05%.',
      },
      {
        kind: 'text',
        content: 'The drop-off was high, but the form was fixable. A small change here could unlock the entire funnel.',
      },
      {
        kind: 'image',
        src: '/images/sf-old.png',
        caption: 'The original form. Four fields, single page, broken SSO.',
      },
    ],
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: 'I removed the phone field and restructured the form into two steps in one go. The data was clear enough that splitting into separate iterations would have just meant weeks of waiting on low traffic.',
      },
      {
        kind: 'text',
        content: 'Step 1: email or Google/Shopify SSO. Account created immediately. SSO now actually creates the account instead of pre-filling two fields on the same form. Step 2: name and store URL.',
      },
      {
        kind: 'compare',
        images: [
          { src: '/images/sf-signupold.png', label: 'Before' },
          { src: '/images/sf-signup1.png', label: 'After' },
          { src: '/images/sf-signup2.png', label: 'After' },
        ],
        caption: 'Step 1 creates the account. Step 2 collects what the product needs.',
      },
      {
        kind: 'text',
        content: 'Built directly in Codex, no separate design phase. On production within 5 hours.',
      },
    ],
    results: {
      headline: '+67% total signup conversion. Desktop doubled. Mobile from 0.05% to 3%.',
      note: 'With prompt engineering and Codex I go from identifying a problem to shipping a fix in the same day. Designing, building, and merging pull requests on production code.',
      northStar: {
        label: 'FROM DIAGNOSIS TO PRODUCTION',
        value: '5 hours',
      },
      metrics: [
        { value: '+67%', label: 'TOTAL SIGNUP CONVERSION', color: 'accent' },
        { value: '+100%', label: 'DESKTOP SIGNUPS', color: 'accent' },
        { value: '+5,900%', label: 'MOBILE SIGNUPS', sublabel: '0.05% → 3%', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Signup works, but does not yet do its job as a first impression',
        description: 'The user provides a store URL and waits 10–30 seconds while AI generates content. That dead time could build anticipation instead. Users from Shopify or Shoper could skip the form entirely through platform OAuth.',
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
    opportunity: [],
    opportunityBlocks: [
      {
        kind: 'text',
        content: "edrone is a marketing automation CRM for ecommerce. When a user integrates their store, their contact base gets imported. edrone can see anonymous activity on the website but cannot connect it to contacts in the base. Identification links the two: when a contact opens an email, a tracking pixel connects their browsing to their profile.",
      },
      {
        kind: 'image',
        src: '/images/ci-module.png',
        caption: 'Contacts are anonymous until they open an email. That action connects them to their browsing activity.',
      },
      {
        kind: 'text',
        content: "Automations in edrone are triggered by customer behaviour on the store: browsing, cart, purchase. They account for **~45% of revenue** generated by edrone and convert **9x better** than newsletters, but they only work for identified contacts.",
      },
      {
        kind: 'text',
        content: "Identification rate sat around 3%. Cookies clear over time and are per device, so it needs to happen continuously. On average ~45% of a user's contact base has no marketing consent, meaning they receive no communication at all. Users pay for these contacts but get no value from them.",
      },
      {
        kind: 'text',
        content: "No competing product supported users with identification in any way.",
      },
    ],
    solution: [],
    processContent: [
      {
        kind: 'text',
        content: "Support had data showing that sending emails to the full base (not just subscribed contacts) raised identification and reduced churn. The method worked, but was entirely manual. I took this proof and built it into the product.",
      },
      {
        kind: 'text',
        content: "I designed a dedicated onboarding step that automates identification entirely. It sits as the third screen in onboarding, after automations and popups, right before integration. The approach was to ship fast with internal consultations and test on production with real users. AI tooling made this viable: building in Codex meant the cost of shipping and learning was lower than the cost of researching upfront.",
      },
      {
        kind: 'text',
        content: "The core decision: the sequence is **on by default**. It activates after integration, users can turn it off but don't need to do anything to turn it on. **Opt-out, not opt-in.**",
      },
      {
        kind: 'image',
        src: '/images/ci-dashboard.png',
        caption: 'The identification screen. Users can explore the full sequence, but nothing requires action.',
      },
      {
        kind: 'text',
        content: "Six emails in the sequence, each different, all non-marketing content (sendable without explicit consent). I designed the template structure; AI generates banners and copy from each store's branding. The sequence starts 24 hours after integration, which imports all user's contacts.",
      },
      {
        kind: 'image',
        src: '/images/ci-email.png',
        caption: 'I designed the template structure. AI generates the branded content.',
      },
      {
        kind: 'text',
        content: "Features should work automatically with zero user fatigue. The user's job is to understand the value, not to operate the machinery.",
      },
      {
        kind: 'text',
        content: "Built the entire frontend in Codex. Backend dev handled sending. Shipped in **6 days**.",
      },
    ],
    results: {
      headline: '95% feature adoption. +19% identification rate globally.',
      metrics: [
        { value: '95%', label: 'FEATURE ADOPTION RATE', sublabel: 'OPT-OUT DESIGN', color: 'accent' },
        { value: '+19%', label: 'TOTAL IDENTIFICATION', sublabel: '3.1% → 3.7%', color: 'accent' },
        { value: '4.1%', label: 'NEW ACCOUNT IDENTIFICATION', sublabel: 'UP FROM 3.1%', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Reactivation module',
        description: 'I designed a reactivation module as the next step: contacts who stop opening emails enter a sequence and eventually get removed, reducing costs and protecting deliverability. Built the frontend in Codex but left edrone before the feature shipped.',
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
