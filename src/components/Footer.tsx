import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { footerGroups } from '@/lib/navigation'
import type { SiteSetting } from '@/payload-types'

import { NewsletterForm } from './NewsletterForm'

const socialLabels: Record<string, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
}

export async function Footer({ settings }: { settings: SiteSetting | null }) {
  const t = await getTranslations('nav')
  const tFooter = await getTranslations('footer')
  const tNews = await getTranslations('newsletter')
  const tMeta = await getTranslations('meta')

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-12 md:grid-cols-2 md:items-end">
          <div>
            <h2 className="font-serif text-3xl leading-tight">{tNews('title')}</h2>
            <p className="mt-2 text-white/70">{tNews('text')}</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
          {footerGroups.map((group) => (
            <div key={group.key}>
              <h3 className="mb-4 text-sm font-medium">
                <Link href={group.href} className="transition-colors duration-150 hover:text-white/80">
                  {t(group.key)}
                </Link>
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                {group.children.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors duration-150 hover:text-white">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-8 border-t border-white/10 pt-8 text-sm text-white/70 md:grid-cols-2">
          <address className="space-y-1 not-italic">
            {settings?.address && <p>{settings.address}</p>}
            {settings?.phone && (
              <p>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="tabular-nums transition-colors duration-150 hover:text-white">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings?.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="transition-colors duration-150 hover:text-white">
                  {settings.email}
                </a>
              </p>
            )}
          </address>
          {settings?.socials && settings.socials.length > 0 && (
            <div className="md:text-right">
              <p className="mb-2 font-medium text-white">{tFooter('followUs')}</p>
              <ul className="flex flex-wrap gap-4 md:justify-end">
                {settings.socials.map((social) => (
                  <li key={social.id ?? social.url}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer me" className="transition-colors duration-150 hover:text-white">
                      {socialLabels[social.platform] ?? social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-white/50 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {tMeta('siteName')}. {tFooter('rights')}
          </p>
          <p className="text-white/70">{tFooter('official')}</p>
        </div>
      </div>
    </footer>
  )
}
