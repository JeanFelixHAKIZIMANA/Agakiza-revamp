import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['rw', 'en'],
  defaultLocale: 'rw',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
