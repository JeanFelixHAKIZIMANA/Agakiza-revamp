'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div role="group" aria-label={t('language')} className="flex h-9 items-center gap-1 text-sm">
      {routing.locales.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted" aria-hidden="true">/</span>}
          <Link
            href={pathname}
            locale={code}
            hrefLang={code}
            aria-current={code === locale ? 'true' : undefined}
            className={`px-1 transition-colors duration-150 ease-out ${
              code === locale ? 'font-medium text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {code.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  )
}
