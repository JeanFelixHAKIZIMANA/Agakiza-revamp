'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div role="group" aria-label={t('language')} className="flex rounded-full border border-line p-0.5 text-xs font-semibold">
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          hrefLang={code}
          aria-current={code === locale ? 'true' : undefined}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            code === locale ? 'bg-brand text-white' : 'text-muted hover:text-brand'
          }`}
        >
          {code}
        </Link>
      ))}
    </div>
  )
}
