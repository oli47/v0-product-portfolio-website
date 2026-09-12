// All site copy lives here — swap `lang` to add Polish support.
// To add PL: duplicate the `en` block below, translate, then wire
// up a language context/hook and pass `lang` to the page.

export const content = {
  en: {
    nav: {
      name: 'Olaf Otrząsek',
      dark: 'Dark',
      light: 'Light',
    },
    hero: {
      positioning: 'I find where users don\u2019t get through, then design the experience that gets them there.',
      body: 'At\u00a0',
      bodyEdrone: 'edrone',
      bodyPost:
        '\u00a0I took the product from sales-gated to self-serve freemium and redesigned most of it, making the judgment calls no salesperson had made before: what runs, what gets asked, and what the product decides on its own. I sell each decision with the evidence that proves it. I prototype and ship production code with Claude Code and v0.dev. 7+ years in SaaS.',
    },
    contact: {
      resume: 'Resume',
      email: 'olafotrzasek@gmail.com',
      phone: '+48\u00a0732\u00a0188\u00a0613',
      phoneRaw: '+48732188613',
      linkedin: 'LinkedIn',
      open: 'open',
      copy: 'copy',
      copied: '\u2713\u00a0Copied',
    },
    sections: {
      projects: 'Selected Projects',
      experience: 'Experience',
    },
    projects: {
      viewCaseStudy: 'View case study',
    },
  },
  // pl: { ... } — TODO: Polish translations
} as const

export type Lang = keyof typeof content
export const defaultLang: Lang = 'en'
