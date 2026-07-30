// ─── Process content block types ────────────────────────────────────────────

export type CompareImage = { src: string; label: string }

export type ProcessBlock =
  | { kind: 'text'; content: string }
  | { kind: 'heading'; content: string }
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'compare'; images: CompareImage[]; caption?: string }
  | { kind: 'contact-flow'; caption?: string }
  | { kind: 'vertical-flow'; steps: { title: string; subtitle?: string; labelAfter?: string; mobileAnnotation?: string }[]; arc?: { fromStep: number; toStep: number; label: string }; caption?: string }
  | { kind: 'decisions'; items: { num: string; title: string; description: string }[] }
  | { kind: 'slideshow'; images: string[]; caption?: string }

// ─── Project interface ───────────────────────────────────────────────────────

/** A badged section rendered between the header and Impact. Add as many as the
 *  story needs — the badge is the label shown above the blocks. */
export interface ProjectSection {
  badge: string
  blocks: ProcessBlock[]
}

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
  sections: ProjectSection[]
  results: {
    note?: string
    metricsAsMain?: boolean   // use MetricMain (not Supporting) for right-column metrics
    northStar?: {
      label: string
      value: string
    }
    metrics: {
      value: string
      label: string
      description?: string
      color?: 'accent' | 'ink'
    }[]
  }
  /** Rendered as plain paragraphs under a Reflections badge. */
  reflections: string[]
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
      team: '1–5 Developers',
      duration: '10 months',
      date: '2025–2026',
    },
    coverImage: '/thumbnails/freemium-activation.png',
    coverImagePosition: 'bottom-right',
    thumbnailImage: '/thumbnails/freemium-activation.png',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation CRM for ecommerce. Every new customer went through Sales: demo, contract, Support-led onboarding. No self-serve path existed.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'I saw consistent inbound traffic in GA that never reached Sales, and built the case for a freemium channel to capture it. Freemium launched May 2025, and over 10 months I iterated on the onboarding through continuous user research and production testing.',
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
        ],
      },
      {
        badge: 'Solution',
        blocks: [
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
            content: 'Developers built the foundation from May. From December, I used Codex to build improvements and fixes across the frontend, with partial support from a frontend and backend developer.',
          },
        ],
      },
    ],
    results: {
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
    reflections: [],
  },
  {
    slug: 'signup-redesign',
    title: 'Signup flow',
    tagline: 'Tripled signup conversion in five hours, with Codex.',
    description: 'Tripled signup conversion in five hours, with Codex.',
    metrics: [
      { value: '+200%', label: 'SIGNUP CONVERSION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Developer',
      duration: '5 hours',
      date: '2026',
    },
    coverImage: '/images/sf-cover.png',
    coverImagePosition: 'center-bottom',
    thumbnailImage: '/images/sf-cover.png',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'edrone is a marketing automation CRM for ecommerce. It exists to keep customers coming back. Automated messages and newsletters bring shoppers back to the store to finish orders they had abandoned, and the rest of the product feeds the same loop.',
          },
          {
            kind: 'text',
            content: 'For ten years edrone sold one way only, through Sales. Freemium was the company\'s first product-led channel, and this work landed four months into it.',
          },
        ],
      },
      {
        badge: 'Goal',
        blocks: [
          {
            kind: 'text',
            content: 'Acquisition was freemium\'s goal at that stage, so the activation funnel was the priority for the Freemium Team I led. Signup was its first step, which meant everything lost there was lost again at every step below it.',
          },
          {
            kind: 'text',
            content: 'In Amplitude the largest drop across the four-step funnel sat between clicking "Sign up free" on the website and creating an account. **0.75% of unique visitors made it through, against a 2–3% market standard.** I led the freemium project, so I took this one on myself. It was the highest-leverage number on the board.',
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: 'I started in Amplitude. I checked the event data was sound, then watched session recordings of that exact step to see what people were doing on the form. That gave me a short list of what I thought was wrong.',
          },
          {
            kind: 'text',
            content: 'Alongside it I ran a UX agent I had built on Claude across the flow. It walks the screens in a browser, clicks through them the way a user would, and returns a report with problem, description and severity.',
          },
          {
            kind: 'text',
            content: 'I used the agent to test my own hypotheses rather than to produce them. It confirmed most of what I had already found, added candidates I had not considered, and ranked them. I picked the ones worth the time and cost of building.',
          },
          {
            kind: 'decisions',
            items: [
              {
                num: 'PROBLEM 1',
                title: 'A mandatory phone number almost nobody used',
                description: 'A leftover from the sales-led funnel. One salesperson was responsible for calling accounts that signed up and then went quiet. **Every user paid for that, at the most expensive moment in the funnel.**',
              },
              {
                num: 'PROBLEM 2',
                title: 'SSO promised one click and delivered a form',
                description: '"Sign up with Google" did not create an account. It took an address from the Google dialog and dropped the user back on the same four fields, now partly filled. **The button looked like a shortcut and behaved like autofill.**',
              },
            ],
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'text',
            content: 'The obvious fix was removing the phone number. The COO pushed back at first, because his concern was Sales losing the ability to qualify leads, which is fair. So I went to Sales and talked to the one person who actually made those calls. He admitted there was no value in them and confirmed the field could go. It stayed removed.',
          },
          {
            kind: 'text',
            content: 'The second was making SSO real. We had just added Shopify alongside Google, so it had to actually create the account across both providers.',
          },
          {
            kind: 'text',
            content: 'Then I went further and split the form to make signing up feel lighter and to capture the account earlier. **Step 1 now creates the account from an email address or SSO. Step 2 collects name and store URL.**',
          },
          {
            kind: 'compare',
            images: [
              { src: '/images/sf-signupold.png', label: 'Before' },
              { src: '/images/sf-signup1.png', label: 'After' },
              { src: '/images/sf-signup2.png', label: 'After' },
            ],
            caption: 'Before: four fields and an SSO button that filled them in. After: step 1 creates the account, step 2 collects what the product needs.',
          },
          {
            kind: 'text',
            content: 'More steps normally means less conversion. My bet was that what people see at the moment of the decision matters more than how many steps follow, and the result says it did. Anyone who drops out of step 2 already has an account, so I set up recovery paths in Intercom to bring them back. The friction moved to after the contact rather than before it.',
          },
          {
            kind: 'text',
            content: 'I designed the flow in Figma, then built the frontend directly in Codex. That part was quick, because Codex already had the coded design system I had built when I joined edrone. A developer handled the backend, reviewed my code and released it. The whole project, from diagnosis through design, build and test to production, fit into **five hours.**',
          },
        ],
      },
    ],
    results: {
      note: 'Unique visitors who ended up with a created account, from **0.75% to 2.25%**. Conversion on to an integrated store did not move, so the extra signups were no worse than the ones before.',
      northStar: {
        label: 'TOTAL SIGNUP CONVERSION',
        value: '+200%',
      },
      metricsAsMain: true,
      metrics: [
        { value: '+270%', label: 'STEP 1 CONVERSION', color: 'accent', description: 'Share of visitors who began filling the form went from **2.7% to 10%**. Desktop 3% to 10%, mobile 1% to 10%. Splitting the form was the bet, and this is what confirms it.' },
      ],
    },
    reflections: [
      'I shipped three changes at once and gave up knowing which one worked better. Traffic was low enough that isolating each change would have meant at least three weeks per change to collect anything meaningful, and an A/B test would have taken longer still. With more traffic I would split it, but at that point I had to move quicker and leaner.',
    ],
  },
  {
    slug: 'contacts-activation',
    title: 'Contacts identification',
    tagline: 'Turned a manual Support task into a zero-touch feature. 95% adoption.',
    description: 'Automations drive ~45% of edrone\'s revenue but only fire for identified contacts. I designed a module that handles identification automatically.',
    metrics: [
      { value: '95%', label: 'ADOPTION', color: 'accent' },
    ],
    meta: {
      role: 'Sr Product Designer',
      team: '1 Back-end developer',
      duration: '6 days',
      date: '2026',
    },
    coverImage: '/images/ci-cover.png',
    coverImagePosition: 'bottom-right',
    thumbnailImage: '/images/ci-thumbnail.png',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: "edrone is a marketing automation CRM for ecommerce. Automations account for ~45% of revenue generated by edrone. They convert 9x better than newsletters and can target all contacts regardless of marketing consent (newsletters only reach the ~60% who opted in). **But automations only fire for identified contacts, and identification sat at ~3%.**",
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "Support had a validated approach: sending non-marketing emails to the full base **drastically reduced churn** and raised identification to as high as 15%. But they were doing it manually, while cookies clear over time and are per device, so identification needs to happen continuously and at full scale.",
          },
          {
            kind: 'contact-flow',
            caption: 'When a contact opens an email, a tracking pixel assigns a cookie and connects their browsing to their profile.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
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
      },
    ],
    results: {
      metricsAsMain: true,
      note: "Enabled automatically after integration. Users can turn it off but don't need to do anything to turn it on. Almost **no one** did.",
      northStar: {
        label: 'FEATURE ADOPTION',
        value: '95%',
      },
      metrics: [
        { value: '+32%', label: 'IDENTIFICATION RATE', description: 'Share of identified contacts among new freemium users after the sequence runs.', color: 'accent' },
      ],
    },
    reflections: [],
  },
  {
    slug: 'plo-genius',
    title: 'PLO Genius',
    tagline: 'A cloud-based PLO solver and trainer. Designed from zero as sole designer.',
    description: "Cloud-based poker solver and trainer. Designed from zero for a game I didn't play.",
    metrics: [
      { value: '10+', label: 'B2B API CLIENTS', color: 'accent' },
    ],
    meta: {
      role: 'Sole Designer',
      team: '1 Front-end developer',
      duration: '2 years',
      date: '2022–2024',
    },
    coverImage: '/images/plo-cover.png',
    coverImagePosition: 'center-bottom',
    thumbnailImage: '/images/plo-cover.png',
    sections: [
      {
        badge: 'Context',
        blocks: [
          {
            kind: 'text',
            content: 'PLO Genius is a cloud-based Pot-Limit Omaha solver and GTO trainer. Before it existed, learning PLO with solvers meant buying a $5,000+ PC to run MonkerSolver and waiting minutes per calculation. There was no affordable, browser-based alternative for PLO players.',
          },
          {
            kind: 'text',
            content: 'Deepsolver (NLH) had already proven that a neural-net cloud solver could work. PLO Genius brought the same approach to Omaha: a more complex game with far fewer learning tools.',
          },
          {
            kind: 'text',
            content: "I was the sole designer. The team was small: the CEO as PM, two professional poker players who were also investors, a frontend developer, and a 3-5 person engine team building the neural-net solver. I owned research, UX, UI, the marketing website, and built a standalone design system to give PLO Genius its own brand identity separate from Deepsolver.",
          },
        ],
      },
      {
        badge: 'Approach',
        blocks: [
          {
            kind: 'text',
            content: "I was designing a learning tool for a game I didn't play. That created a real gap in research. Beginners couldn't articulate what they needed because they didn't understand the game well enough yet. Pro players operated on intuition and methods that were hard to translate into interface decisions.",
          },
          {
            kind: 'text',
            content: 'The bridge turned out to be poker stables: organizations where a knowledgeable lead managed groups of players at different levels. Those leads understood both the theory and the learning process, which made them the most useful collaborators for validating design decisions.',
          },
        ],
      },
      {
        badge: 'Solution',
        blocks: [
          {
            kind: 'image',
            src: '/images/plo-preflop.png',
            caption: 'Preflop solver. Range charts and matrices showing optimal plays across stack sizes, positions, and rake structures.',
          },
          {
            kind: 'image',
            src: '/images/plo-postflop.png',
            caption: 'Postflop solver. Hand breakdown with equity visualizations showing how a hand performs against opponent ranges on a specific board.',
          },
          {
            kind: 'image',
            src: '/images/plo-trainer.png',
            caption: 'GTO Trainer. Up to 4 tables simultaneously, designed to feel like a real session. Players practice strategy and track accuracy without custom bets, keeping focus on learning correct play.',
          },
          {
            kind: 'text',
            content: 'The product launched, found paying users, and is still live four years later.',
          },
        ],
      },
    ],
    results: {
      metricsAsMain: true,
      metrics: [
        { value: '10+', label: 'B2B API CLIENTS', color: 'accent', description: 'Platforms licensing the neural-net engine. Primary revenue channel.' },
        { value: '120+', label: 'PAYING SUBSCRIBERS', color: 'accent', description: 'Players using the app I designed. Three tiers: $0 / $59 / $125.' },
      ],
    },
    reflections: [],
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
