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
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-10 flex flex-col gap-4 rounded-xl bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{tNews('title')}</h2>
            <p className="text-sm text-white/70">{tNews('text')}</p>
          </div>
          <div className="md:w-1/2">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {footerGroups.map((group) => (
            <div key={group.key}>
              <h3 className="mb-3 text-sm font-semibold text-gold">
                <Link href={group.href} className="hover:underline">
                  {t(group.key)}
                </Link>
              </h3>
              <ul className="space-y-2 text-sm text-white/80">
                {group.children.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 text-sm text-white/70 md:flex-row md:justify-between">
          <div className="space-y-1">
            {settings?.address && <p>{settings.address}</p>}
            {settings?.phone && <p><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white">{settings.phone}</a></p>}
            {settings?.email && <p><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></p>}
          </div>
          {settings?.socials && settings.socials.length > 0 && (
            <div>
              <p className="mb-2 font-semibold text-white">{tFooter('followUs')}</p>
              <ul className="flex flex-wrap gap-3">
                {settings.socials.map((social) => (
                  <li key={social.id ?? social.url}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer me" className="hover:text-white">
                      {socialLabels[social.platform] ?? social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-white/60 md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {tMeta('siteName')}. {tFooter('rights')}
          </p>
          <p className="font-medium text-gold">{tFooter('official')}</p>
        </div>
      </div>
    </footer>
  )
}
