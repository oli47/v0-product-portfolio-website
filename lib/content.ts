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
      positioning: 'Hey, I\u2019m Olaf. I just like making things better.',
      body: 'Product designer with 7+ years in SaaS. I design how a product works as much as how it looks, find what to fix in the data and ship it myself with\u00a0',
      bodyClaude: 'Claude Code',
      bodyMid: '. At\u00a0',
      bodyEdrone: 'edrone',
      bodyEnd: ' I also covered the PM role, so I owned design end to end, from research to production.',
      contactLead: 'Email me at ',
      contactOr: ' or call ',
      contactBridge: '. My ',
      closingResume: 'resume',
      closingMid: ' is right here, and I’m on ',
      closingLinkedin: 'LinkedIn',
      closingEnd: ' too.',
    },
    contact: {
      email: 'olafotrzasek@gmail.com',
      phone: '+48\u00a0732\u00a0188\u00a0613',
      phoneRaw: '+48732188613',
      copy: 'copy',
      open: 'open',
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
