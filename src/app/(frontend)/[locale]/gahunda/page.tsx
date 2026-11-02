import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { longDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { alternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('events'), alternates: alternates(locale, '/gahunda') }
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  const tForms = await getTranslations('forms')

  const payload = await getPayloadClient()
  const { docs: events } = await payload.find({
    collection: 'events',
    locale: locale as 'rw' | 'en',
    where: { _status: { equals: 'published' }, startsAt: { greater_than: new Date().toISOString() } },
    sort: 'startsAt',
    limit: 50,
  })
  const dateFormat = longDate(locale)

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-24 md:px-8 md:pt-24">
      <h1 className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-[56px] md:tracking-[-0.03em]">
        {t('events')}
      </h1>
      <div className="mt-12">
        {events.length === 0 ? (
          <p className="text-secondary">{tForms('upcomingEmpty')}</p>
        ) : (
          <ul className="border-t border-line">
            {events.map((event) => (
              <li key={event.id} className="grid gap-1 border-b border-line py-6 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-6">
                <time className="text-sm text-muted tabular-nums" dateTime={event.startsAt}>
                  {dateFormat.format(new Date(event.startsAt))}
                </time>
                <div>
                  <h2 className="font-serif text-2xl leading-snug">
                    <Link href={`/gahunda/${event.slug}`} className="transition-colors duration-150 hover:text-brand">
                      {event.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-secondary">{event.venue}</p>
                </div>
                <Link href={`/gahunda/${event.slug}`} className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover">
                  {t('register')} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
