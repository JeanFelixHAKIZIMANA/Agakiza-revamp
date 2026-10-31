import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { headerNav } from '@/lib/navigation'

import { LanguageToggle } from './LanguageToggle'

export async function Header() {
  const t = await getTranslations('nav')
  const tMeta = await getTranslations('meta')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Text wordmark until the new logo files arrive. */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-xl font-bold text-brand">{tMeta('siteName')}</span>
          <span className="text-[11px] font-medium text-gold-dark">{tMeta('tagline')}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-5 text-sm font-medium">
            {headerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink hover:text-brand">
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
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-dark hover:text-white sm:inline-block"
          >
            {t('give')}
          </Link>
          {/* Mobile menu without client JavaScript. */}
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-1.5 text-sm font-medium">
              {t('menu')}
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-56 rounded-lg border border-line bg-white p-2 shadow-lg">
              <ul>
                {[...headerNav, { key: 'give', href: '/fasha-umurimo' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded px-3 py-2 text-sm hover:bg-brand-light">
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
