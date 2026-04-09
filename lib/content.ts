// All site copy lives here — swap `lang` to add Polish support.
// To add PL: duplicate the `en` block below, translate, then wire
// up a language context/hook and pass `lang` to the page.

export const content = {
  en: {
    nav: {
      name: 'Olaf Otrząsek',
      status: 'Open to opportunities',
      dark: 'Dark',
      light: 'Light',
      langSwitch: 'PL',
    },
    hero: {
      headlinePre: 'I design the moments where products\u00a0',
      headlineAccent: 'start working',
      headlinePost: '\u00a0for people.',
      body: 'Senior Product Designer, 7+ years in B2B SaaS. I use product data to find the places where users don\u2019t get through, then design the experience that gets them there. At\u00a0',
      bodyEdrone: 'edrone',
      bodyPost:
        '\u00a0I rebuilt the platform from sales-gated to self-serve freemium, redesigned most of the product, and grew the design team from one to three. AI tools are part of how I work every day.',
    },
    contact: {
      resume: 'Resume',
      email: 'olafotrzasek@gmail.com',
      phone: '+48\u00a0732\u00a0188\u00a0613',
      phoneRaw: '+48732188613',
      linkedin: 'LinkedIn',
      copied: '\u2713\u00a0Copied',
    },
    sections: {
      projects: 'Selected Projects',
      currently: 'Currently',
      experience: 'Experience',
    },
    currently:
      'Looking for a Senior Product Designer or Design Lead role at a B2B SaaS scale-up in the EU. End-to-end product thinking, sharp UI, and experience leading small teams people enjoy being part of. Based in Warsaw.',
    projects: {
      soon: 'Soon',
      discover: 'Discover',
    },
  },
  // pl: { ... } — TODO: Polish translations
} as const

export type Lang = keyof typeof content
export const defaultLang: Lang = 'en'
