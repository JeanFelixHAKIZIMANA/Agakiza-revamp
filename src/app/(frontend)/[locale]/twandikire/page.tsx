import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { ContactForm } from '@/components/forms/ContactForm'
import { SplitPage } from '@/components/PageIntro'
import { alternates } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tForms = await getTranslations({ locale, namespace: 'forms' })
  return { title: t('contact'), description: tForms('contactIntro'), alternates: alternates(locale, '/twandikire') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  const tForms = await getTranslations('forms')
  const settings = await getSiteSettings(locale)
  const whatsapp = settings?.whatsappNumber?.replace(/\D/g, '')

  const details = [
    settings?.address && { label: settings.address },
    settings?.phone && { label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    settings?.email && { label: settings.email, href: `mailto:${settings.email}` },
    whatsapp && { label: 'WhatsApp', href: `https://wa.me/${whatsapp}` },
  ].filter(Boolean) as { label: string; href?: string }[]

  return (
    <SplitPage
      title={t('contact')}
      intro={tForms('contactIntro')}
      aside={
        details.length > 0 && (
          <address className="mt-10 border-t border-line not-italic">
            {details.map((item) => (
              <p key={item.label} className="flex h-12 items-center border-b border-line">
                {item.href ? (
                  <a href={item.href} className="text-brand transition-colors duration-150 hover:text-brand-hover">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </p>
            ))}
          </address>
        )
      }
    >
      <ContactForm />
    </SplitPage>
  )
}
