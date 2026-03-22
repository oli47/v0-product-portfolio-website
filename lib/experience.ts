export interface Experience {
  dateRange: string
  logoText: string
  company: string
  companyUrl: string
  role: string
  isCurrent: boolean
  products?: {
    name: string
    url: string
  }[]
}

export const experiences: Experience[] = [
  {
    dateRange: '2022 – now',
    logoText: 'ed',
    company: 'edrone',
    companyUrl: 'https://edrone.me',
    role: 'Senior Product Designer / Team Lead',
    isCurrent: true,
  },
  {
    dateRange: '2020 – 2022',
    logoText: 'ds',
    company: 'Deepsolver',
    companyUrl: 'https://deepsolver.com',
    role: 'Product Designer',
    isCurrent: false,
    products: [
      { name: 'Deepsolver', url: 'https://deepsolver.com' },
      { name: 'PLO Genius', url: 'https://plogenius.com' },
    ],
  },
  {
    dateRange: '2019 – 2020',
    logoText: 'eq',
    company: 'eq system',
    companyUrl: 'https://www.eqsystem.pl',
    role: 'UX Designer',
    isCurrent: false,
  },
  {
    dateRange: '2019',
    logoText: 'is',
    company: 'Inventive Software',
    companyUrl: 'https://inventivesoftware.com',
    role: 'Junior UX/UI Designer',
    isCurrent: false,
  },
]
