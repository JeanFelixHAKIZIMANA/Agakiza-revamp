import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { routing } from '@/i18n/routing'
import { alternates } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings'
import { siteUrl } from '@/lib/site'

import '../globals.css'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t('siteName')} | ${t('tagline')}`, template: `%s | ${t('siteName')}` },
    description: t('description'),
    alternates: alternates(locale),
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: locale === 'rw' ? 'rw_RW' : 'en_US',
      url: `${siteUrl}/${locale}`,
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const settings = await getSiteSettings(locale)
  const t = await getTranslations({ locale, namespace: 'meta' })

  // Tells Google which site and social profiles are the real Agakiza.
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('siteName'),
    url: siteUrl,
    email: settings?.email ?? undefined,
    telephone: settings?.phone ?? undefined,
    sameAs: settings?.socials?.map((social) => social.url) ?? [],
  }

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsAppButton number={settings?.whatsappNumber} />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  )
}
