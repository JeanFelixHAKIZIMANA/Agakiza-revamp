import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cache } from 'react'

import { RegistrationForm } from '@/components/forms/RegistrationForm'
import { Link } from '@/i18n/navigation'
import { seatsLeft } from '@/lib/events'
import { getPayloadClient } from '@/lib/payload'
import { alternates } from '@/lib/seo'
import { siteUrl } from '@/lib/site'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const dynamic = 'force-dynamic'

const getEvent = cache(async (slug: string, locale: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    locale: locale as 'rw' | 'en',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const event = await getEvent(slug, locale)
  if (!event) return {}
  return { title: event.title, alternates: alternates(locale, `/gahunda/${slug}`) }
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const event = await getEvent(slug, locale)
  if (!event) notFound()

  const t = await getTranslations('forms')
  const tNav = await getTranslations('nav')
  const poster = event.poster && typeof event.poster === 'object' ? (event.poster as Media) : null
  const when = new Intl.DateTimeFormat(locale === 'rw' ? 'rw-RW' : 'en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Kigali',
  }).format(new Date(event.startsAt))
  const seats = await seatsLeft(event.id, event.capacity)
  const isPast = new Date(event.startsAt) < new Date()
  const canRegister = event.registrationOpen && !isPast && seats !== 0

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt,
    endDate: event.endsAt ?? undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: event.venue, address: event.venue },
    image: poster?.url ? new URL(poster.url, siteUrl).toString() : undefined,
    organizer: { '@type': 'Organization', name: 'Agakiza', url: siteUrl },
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-12 pb-24 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8 md:pt-20">
      <div>
        <Link href="/gahunda" className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover">
          ← {tNav('events')}
        </Link>
        <h1 className="mt-6 font-serif text-[36px] leading-[1.08] tracking-[-0.02em] md:text-[48px] md:tracking-[-0.03em]">
          {event.title}
        </h1>
        <dl className="mt-8 border-t border-line text-sm">
          <div className="flex gap-4 border-b border-line py-3">
            <dt className="w-28 shrink-0 text-muted">{t('when')}</dt>
            <dd className="tabular-nums">{when}</dd>
          </div>
          <div className="flex gap-4 border-b border-line py-3">
            <dt className="w-28 shrink-0 text-muted">{t('venue')}</dt>
            <dd>
              {event.venue}
              {event.mapUrl && (
                <>
                  {' · '}
                  <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-hover">
                    {t('map')}
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>
        {poster?.url && (
          <Image
            src={poster.sizes?.card?.url ?? poster.url}
            alt={poster.alt}
            width={800}
            height={600}
            className="mt-8 w-full rounded-2xl object-cover"
          />
        )}
        {event.description && <RichText data={event.description} className="rich-text mt-8" />}
      </div>

      <div className="self-start rounded-2xl border border-line bg-card p-6 md:p-10">
        <h2 className="mb-6 font-serif text-2xl">{tNav('register')}</h2>
        {canRegister ? (
          <RegistrationForm eventId={event.id} maxAttendants={Math.min(seats ?? 100, 100)} />
        ) : (
          <p className="text-secondary">{seats === 0 ? t('full') : t('closed')}</p>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, '\\u003c') }}
      />
    </section>
  )
}
