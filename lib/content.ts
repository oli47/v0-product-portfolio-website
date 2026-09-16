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
      positioning: 'Hey, I\u2019m Olaf. Enhancing things is what I actually like doing.',
      body: 'A product designer for over 7 years now, the last four at\u00a0',
      bodyEdrone: 'edrone',
      bodyMid:
        '. The logic behind a product matters to me as much as the interface on top of it. Data is where I find the next opportunity, and I ship the fix myself, with\u00a0',
      bodyClaude: 'Claude Code',
      bodyEnd: '.',
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
