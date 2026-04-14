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
  | { kind: 'contact-flow'; caption?: string }
  | { kind: 'before-after-flow'; before: string[]; after: string[]; caption?: string }
  | { kind: 'vertical-flow'; steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]; arc?: { fromStep: number; toStep: number; label: string }; caption?: string }
  | { kind: 'decisions'; items: { num: string; title: string; description: string }[] }
  | { kind: 'slideshow'; images: string[]; caption?: string }

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
  coverImagePosition?: 'bottom-right' | 'center-bottom'
  thumbnailImage: string
  opportunityBlocks: ProcessBlock[]
  processContent: ProcessBlock[]
  results: {
    headline: string
    subheadline?: string
    note?: string
    metricsAsMain?: boolean   // use MetricMain (not Supporting) for right-column metrics
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
      description?: string
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
    tagline: 'From sales-gated to self-serve. 4657 accounts in 10 months.',
    description: "edrone had no self-serve path. Every new customer went through Sales. This is the acquisition model I built alongside it.",
    metrics: [
      { value: '8.4%', label: 'PAID CONVERSION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1–5 Engineers',
      duration: '10 months',
      date: '2025–2026',
    },
    coverImage: '/thumbnails/freemium-activation.png',
    coverImagePosition: 'bottom-right',
    thumbnailImage: '/thumbnails/freemium-activation.png',
    opportunityBlocks: [
      {
        kind: 'text',
        content: 'edrone is a marketing automation CRM for ecommerce.',
      },
    ],
    processContent: [
      {
        kind: 'text',
        content: 'Freemium launched May 2025. Over 10 months I iterated on the onboarding through continuous user research and production testing.',
      },
      {
        kind: 'text',
        content: 'Together with two Support team members I brought in as my freemium sub-team, we ran dozens of interviews with fresh signups throughout the project and internal sessions with Support\'s onboarding and success teams. With each shipped iteration we analysed how users behaved and what could make the experience more seamless.',
      },
      {
        kind: 'text',
        content: '**The vast majority of users reaching edrone were small, one-person stores.** No time, no MA experience, no idea whether it would pay off. They could not invest hours into understanding, configuring, or learning a tool. **Everything had to work without asking them to build anything.**',
      },
      {
        kind: 'slideshow',
        images: ['/images/freeold1.png', '/images/freeold2.png', '/images/freeold3.png', '/images/freeold4.png', '/images/freeold5.png'],
        caption: 'Early version, May 2025.',
      },
      {
        kind: 'vertical-flow',
        steps: [
          { title: 'Signup', subtitle: 'User creates an account' },
          { title: 'AI content', subtitle: "User sees their store's branded content ready to go" },
          { title: 'Activation', subtitle: 'User reviews what is already on. No setup needed.', labelAfter: 'USER HAS SEEN THE VALUE' },
          { title: 'Integration', subtitle: 'User decides to connect their store', mobileAnnotation: 'INITIALLY AFTER SIGNUP' },
          { title: 'AHA moment', subtitle: 'User sees their first order driven by edrone' },
        ],
        arc: { fromStep: 1, toStep: 3, label: 'INITIAL PROCESS' },
        caption: 'The final activation path. Value demonstrated before any commitment.',
      },
      {
        kind: 'text',
        content: 'Users create an account, AI generates branded content from their store URL: newsletters, automations, pop-ups ready to send on arrival. Everything is on by default: 7 automations, popup, and identification sequence active from day one. I started with nothing enabled and tested increments until activation stopped improving. The free tier is capped at 500 messages: the minimum for a user to reach their first attributed order. Integration comes last because connecting a store means sharing contacts and product data. Users make that decision after seeing what edrone does.',
      },
      {
        kind: 'slideshow',
        images: ['/images/freemiumgif1.png', '/images/freemiumgif2.png', '/images/freemiumgif3.png', '/images/freemiumgif4.png'],
        caption: 'The shipped onboarding.',
      },
      {
        kind: 'text',
        content: 'I set the NSM as **time to first attributed order.** That is when users see real revenue and the upgrade decision forms.',
      },
      {
        kind: 'text',
        content: 'Engineers built the foundation from May. From December, I used Codex to build improvements and fixes across the frontend, with partial support from a frontend and backend developer.',
      },
    ],
    results: {
      headline: '4600 freemium accounts in 10 months. 78% activation rate.',
      note: "Freemium's north star metric. Shortening newsletter delivery from **13 to 1 day** was a major contributor. Newsletters generate orders, and the earlier they go out, the faster users see ROI.",
      northStar: {
        label: 'TIME TO FIRST ATTRIBUTED ORDER',
        value: '44 → 5 days',
      },
      metrics: [
        { value: '+4600', label: 'TOTAL NEW USERS', color: 'accent', description: '78% were active users, integrated with 5+ automations running.' },
        { value: '8.4%', label: 'PAID CONVERSION', color: 'accent', description: '~400 paying customers, adding **16%** to edrone\'s paid base built over 10 years. Industry average for freemium SaaS is **2–5%**.' },
      ],
    },
    nextSteps: [],
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
    coverImagePosition: 'center-bottom',
    thumbnailImage: '/images/sf-cover.png',
    opportunityBlocks: [
      {
        kind: 'text',
        content: 'edrone is a marketing automation CRM for ecommerce. The platform had just launched a self-serve freemium tier, but the signup form was still built for the sales-led era. Amplitude showed massive drop-off at the form. **A Claude-powered UX agent I had built confirmed two issues by auditing the full signup flow:** the phone field was the primary drop-off point, and SSO did not actually create an account. Mobile conversion sat at 0.05%.',
      },
      {
        kind: 'text',
        content: 'The drop-off was on the very first step of the freemium funnel. Fixing it would compound through every step downstream.',
      },
    ],
    processContent: [
      {
        kind: 'text',
        content: 'Two problems, two fixes, shipped at once. Splitting them would have meant **waiting at least 3 weeks per change** to collect meaningful data on low traffic.',
      },
      {
        kind: 'decisions',
        items: [
          {
            num: 'FIX 1',
            title: 'Phone field was the primary drop-off',
            description: 'Sales confirmed they no longer used it. I removed it. The product only needed three fields: email, name, and store URL.',
          },
          {
            num: 'FIX 2',
            title: 'SSO did not create an account',
            description: 'I restructured into two steps: **step 1 creates the account** (email or SSO), **step 2 collects name and store URL.** SSO now works as expected.',
          },
        ],
      },
      {
        kind: 'compare',
        images: [
          { src: '/images/sf-signupold.png', label: 'Before' },
          { src: '/images/sf-signup1.png', label: 'After' },
          { src: '/images/sf-signup2.png', label: 'After' },
        ],
        caption: 'After changes, step 1. Creates the account. step 2. Collects what the product needs.',
      },
      {
        kind: 'text',
        content: 'I built the entire frontend directly in Codex, no separate design phase in Figma. The frontend developer handled the backend changes. **On production within 5 hours.**',
      },
    ],
    results: {
      headline: '+67% total signup conversion. Desktop doubled. Mobile from 0.05% to 3%.',
      note: '**Desktop** signups doubled **(+100%)**. **Mobile** went from 0.05% to 3%, a **5900%** increase.',
      northStar: {
        label: 'TOTAL SIGNUP CONVERSION',
        value: '+67%',
      },
      metrics: [],
    },
    nextSteps: [
      {
        title: 'Signup as a first impression',
        description: 'The user provides a store URL and waits 10–30 seconds while AI generates content. That dead time could build anticipation instead.',
      },
      {
        title: 'Platform OAuth',
        description: 'Users from Shopify or Shoper could skip the form entirely.',
      },
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts identification',
    tagline: 'Turned a manual Support task into a zero-touch feature. 95% adoption.',
    description: 'Automations drive ~45% of edrone\'s revenue but only fire for identified contacts. I designed a module that handles identification automatically.',
    metrics: [
      { value: '95%', label: 'ADOPTION', color: 'accent' },
      { value: '+32%', label: 'IDENTIFICATION RATE', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      duration: '8 days',
      date: '2026',
    },
    coverImage: '/images/ci-cover.png',
    coverImagePosition: 'bottom-right',
    thumbnailImage: '/images/ci-cover.png',
    opportunityBlocks: [
      {
        kind: 'text',
        content: "edrone is a marketing automation CRM for ecommerce. Automations account for ~45% of revenue generated by edrone. They convert 9x better than newsletters and can target all contacts regardless of marketing consent (newsletters only reach the ~60% who opted in). **But automations only fire for identified contacts, and identification sat at ~3%.**",
      },
      {
        kind: 'text',
        content: "Support had a validated approach: sending non-marketing emails to the full base **drastically reduced churn** and raised identification to as high as 15%. But they were doing it manually, while cookies clear over time and are per device, so identification needs to happen continuously and at full scale. No competing product offered anything like it.",
      },
      {
        kind: 'contact-flow',
        caption: 'When a contact opens an email, a tracking pixel assigns a cookie and connects their browsing to their profile.',
      },
    ],
    processContent: [
      {
        kind: 'text',
        content: "I designed the contacts activation screen with a dedicated **identification module** and placed it as one of four core onboarding steps, right before integration.",
      },
      {
        kind: 'image',
        src: '/images/ci-dashboard.png',
        caption: 'The identification screen. Users can explore the full sequence, but nothing requires action.',
      },
      {
        kind: 'text',
        content: "The screen contains a sequence of 6 branded, AI-generated emails, sent every 30 days in loop to grow identification. The sequence starts 24 hours after integration to allow the data to sync.",
      },
      {
        kind: 'image',
        src: '/images/ci-email.png',
        caption: 'I designed the template structure. AI generates the branded content.',
      },
      {
        kind: 'text',
        content: "**The sequence is on by default.** It activates automatically after integration for new users only. Existing users had it off, with a plan for Support to enable it gradually. Opt-out, not opt-in.",
      },
      {
        kind: 'text',
        content: "Built the entire frontend in Codex. Backend dev handled sending. **Shipped in 6 days.**",
      },
    ],
    results: {
      headline: '95% feature adoption. +32% identification rate for new users.',
      metricsAsMain: true,
      note: "Enabled automatically after integration. Users can turn it off but don't need to do anything to turn it on. Almost **no one** did.",
      northStar: {
        label: 'FEATURE ADOPTION',
        value: '95%',
      },
      metrics: [
        { value: '+32%', label: 'IDENTIFICATION RATE', description: 'Compared to all users before the module. More identified contacts, **more automations** firing, higher ROI.', color: 'accent' },
      ],
    },
    nextSteps: [
      {
        title: 'Reactivation module',
        description: 'Contacts who stop opening emails enter a sequence and eventually get removed, reducing costs and protecting deliverability. I designed the screen and built the frontend in Codex.',
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
