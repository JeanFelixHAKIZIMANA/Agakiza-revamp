import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'

import { siteUrl } from './site'

// Canonical and hreflang links for a path that exists in every locale.
export function alternates(locale: string, path = ''): Metadata['alternates'] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((code) => [code, `${siteUrl}/${code}${path}`]),
  )
  languages['x-default'] = `${siteUrl}/${routing.defaultLocale}${path}`
  return { canonical: `${siteUrl}/${locale}${path}`, languages }
}
