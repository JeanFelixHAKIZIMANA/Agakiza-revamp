import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'
import type { Event, Media, Story } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

// Content comes from the CMS, so render on request.
export const dynamic = 'force-dynamic'

async function getHomeContent(locale: 'rw' | 'en'): Promise<{ stories: Story[]; events: Event[] }> {
  try {
    const payload = await getPayloadClient()
    const [stories, events] = await Promise.all([
      payload.find({
        collection: 'stories',
        locale,
        limit: 3,
        sort: '-publishedAt',
        where: { _status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'events',
        locale,
        limit: 3,
        sort: 'startsAt',
        where: { _status: { equals: 'published' }, startsAt: { greater_than: new Date().toISOString() } },
      }),
    ])
    return { stories: stories.docs, events: events.docs }
  } catch {
    return { stories: [], events: [] }
  }
}

function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="text-sm font-semibold text-brand hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tNav = await getTranslations('nav')
  const tMeta = await getTranslations('meta')
  const { stories, events } = await getHomeContent(locale as 'rw' | 'en')
  const dateFormat = new Intl.DateTimeFormat(locale === 'rw' ? 'rw-RW' : 'en-GB', { dateStyle: 'long' })

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-3 text-sm font-semibold tracking-wide text-gold uppercase">{tMeta('tagline')}</p>
          <h1 className="max-w-3xl text-4xl leading-tight font-bold md:text-5xl">{t('heroText')}</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ibyo-dukora" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-dark hover:bg-brand-light">
              {t('explore')}
            </Link>
            <Link href="/fasha-umurimo" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:bg-gold-dark hover:text-white">
              {tNav('give')}
            </Link>
          </div>
        </div>
      </section>

      {/* Verse of the day. The verse queue in the admin replaces this placeholder. */}
      <section className="mx-auto -mt-10 max-w-6xl px-4">
        <div className="rounded-2xl border-l-4 border-gold bg-white p-6 shadow-lg md:p-8">
          <p className="mb-2 text-sm font-semibold text-gold-dark uppercase">{t('verseTitle')}</p>
          <blockquote className="text-lg text-ink md:text-xl">
            “Nawe Betelehemu ho mu gihugu cya Yuda, ni ukuri nturi mutoya mu midugudu ikomeye ya Yuda, kuko muri wowe ari ho hazaturuka umutware, uzaragira ubwoko bwanjye bw&apos;Abisirayeli.”
          </blockquote>
          <p className="mt-2 text-sm text-muted">Matayo 2:6</p>
        </div>
      </section>

      {/* Ibyo dukora */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading title={tNav('whatWeDo')} href="/ibyo-dukora" linkLabel={t('viewAll')} />
        {stories.length === 0 ? (
          <p className="text-muted">{t('storiesEmpty')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story) => {
              const cover = typeof story.cover === 'object' ? (story.cover as Media) : null
              const image = cover?.sizes?.card?.url ?? cover?.url
              return (
                <article key={story.id} className="overflow-hidden rounded-xl border border-line bg-white">
                  {image && (
                    <Image src={image} alt={cover?.alt ?? ''} width={800} height={600} className="aspect-[4/3] w-full object-cover" />
                  )}
                  <div className="p-5">
                    <time className="text-xs text-muted" dateTime={story.publishedAt}>
                      {dateFormat.format(new Date(story.publishedAt))}
                    </time>
                    <h3 className="mt-1 text-lg font-semibold">
                      <Link href={`/ibyo-dukora/${story.slug}`} className="hover:text-brand">
                        {story.title}
                      </Link>
                    </h3>
                    {story.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{story.excerpt}</p>}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Get help */}
      <section className="bg-brand-light">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{t('helpTitle')}</h2>
            <p className="mt-1 text-muted">{t('helpText')}</p>
          </div>
          <Link href="/saba-umwanya" className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">
            {tNav('book')}
          </Link>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading title={tNav('events')} href="/gahunda" linkLabel={t('viewAll')} />
        {events.length === 0 ? (
          <p className="text-muted">{t('eventsEmpty')}</p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {events.map((event) => (
              <li key={event.id} className="flex flex-col gap-1 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted">
                    {dateFormat.format(new Date(event.startsAt))} · {event.venue}
                  </p>
                </div>
                <Link href={`/gahunda/${event.slug}`} className="text-sm font-semibold text-brand hover:underline">
                  {tNav('events')} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Fasha umurimo */}
      <section className="mx-auto mb-16 max-w-6xl px-4">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gold/15 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{tNav('give')}</h2>
            <p className="mt-1 text-muted">{t('giveText')}</p>
          </div>
          <Link href="/fasha-umurimo" className="rounded-full bg-gold px-6 py-3 font-semibold text-ink hover:bg-gold-dark hover:text-white">
            {tNav('give')}
          </Link>
        </div>
      </section>
    </>
  )
}
