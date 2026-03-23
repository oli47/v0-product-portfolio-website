export interface Experience {
  dateRange: string
  logo?: string
  company: string
  companyUrl: string
  role: string
  isCurrent: boolean
}

export const experiences: Experience[] = [
  {
    dateRange: '2022 – 2026',
    logo: '/images/logo-edrone.png',
    company: 'edrone',
    companyUrl: 'https://edrone.me',
    role: 'Senior Product Designer / Team Lead',
    isCurrent: true,
  },
  {
    dateRange: '2023 – 2022',
    logo: '/images/logo-deepsolver.png',
    company: 'Deepsolver',
    companyUrl: 'https://deepsolver.com',
    role: 'Product Designer',
    isCurrent: false,
  },
  {
    dateRange: '2019 – 2020',
    logo: '/images/logo-eqsystem.png',
    company: 'eq.system',
    companyUrl: 'https://www.eqsystem.pl',
    role: 'UX Designer',
    isCurrent: false,
  },
  {
    dateRange: '2018',
    company: 'Inventive Software',
    companyUrl: 'https://inventivesoftware.com',
    role: 'Junior UX/UI Designer',
    isCurrent: false,
  },
]
