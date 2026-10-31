// Site structure. Labels are message keys under "nav" in src/messages/*.json.
export type NavItem = { key: string; href: string }
export type NavGroup = NavItem & { children: NavItem[] }

export const headerNav: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'whatWeDo', href: '/ibyo-dukora' },
  { key: 'training', href: '/amahugurwa' },
  { key: 'family', href: '/umuryango' },
  { key: 'innerHealing', href: '/isanamitima' },
  { key: 'news', href: '/amakuru' },
  { key: 'about', href: '/abo-turibo' },
]

export const footerGroups: NavGroup[] = [
  {
    key: 'training',
    href: '/amahugurwa',
    children: [
      { key: 'evangelism', href: '/amahugurwa/ivugabutumwa' },
      { key: 'testimonies', href: '/amahugurwa/ubuhamya' },
      { key: 'conferences', href: '/amahugurwa/ibiterane' },
    ],
  },
  {
    key: 'family',
    href: '/umuryango',
    children: [
      { key: 'youth', href: '/umuryango/urubyiruko' },
      { key: 'engaged', href: '/umuryango/abitegura-gushakana' },
      { key: 'women', href: '/umuryango/abagore' },
      { key: 'men', href: '/umuryango/abagabo' },
    ],
  },
  {
    key: 'innerHealing',
    href: '/isanamitima',
    children: [{ key: 'familyTherapy', href: '/saba-umwanya' }],
  },
  {
    key: 'about',
    href: '/abo-turibo',
    children: [
      { key: 'whatWeDo', href: '/ibyo-dukora' },
      { key: 'beliefs', href: '/ibyo-twizera' },
      { key: 'contact', href: '/twandikire' },
      { key: 'give', href: '/fasha-umurimo' },
      { key: 'partners', href: '/abafatanyabikorwa' },
    ],
  },
  {
    key: 'news',
    href: '/amakuru',
    children: [{ key: 'events', href: '/gahunda' }],
  },
]

// Every page the navigation links to, mapped to its nav label key. Pages not
// built yet render a placeholder instead of a dead link.
export const knownPages: Record<string, string> = Object.fromEntries(
  [...headerNav, ...footerGroups.flatMap((group) => [group, ...group.children]), { key: 'give', href: '/fasha-umurimo' }, { key: 'book', href: '/saba-umwanya' }]
    .filter((item) => item.href !== '/')
    .map((item) => [item.href, item.key]),
)
