import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { headerNav } from '@/lib/navigation'

import { LanguageToggle } from './LanguageToggle'

export async function Header() {
  const t = await getTranslations('nav')
  const tMeta = await getTranslations('meta')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-8">
        {/* Text wordmark until the new logo files arrive. */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl leading-none font-medium text-brand">{tMeta('siteName')}</span>
          <span className="hidden text-xs text-muted sm:inline">{tMeta('tagline')}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {headerNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-secondary transition-colors duration-150 ease-out hover:text-ink">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/fasha-umurimo"
            className="hidden h-9 items-center rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-brand-hover sm:inline-flex"
          >
            {t('give')}
          </Link>
          {/* Mobile menu without client JavaScript. */}
          <details className="relative lg:hidden">
            <summary className="flex h-9 cursor-pointer list-none items-center rounded-lg border border-line px-3 text-sm">
              {t('menu')}
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-card p-1 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <ul>
                {[...headerNav, { key: 'give', href: '/fasha-umurimo' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex h-10 items-center rounded-lg px-3 text-sm transition-colors duration-150 hover:bg-raised">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
