import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'
import { type DailyVerse, fallbackVerse, getVerseOfTheDay } from '@/lib/verseOfTheDay'
import type { Event, Media, Story } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

// Content comes from the CMS, so render on request.
export const dynamic = 'force-dynamic'

async function getHomeContent(
  locale: 'rw' | 'en',
): Promise<{ stories: Story[]; events: Event[]; verse: DailyVerse }> {
  try {
    const payload = await getPayloadClient()
    const [stories, events, verse] = await Promise.all([
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
      getVerseOfTheDay(payload, locale),
    ])
    return { stories: stories.docs, events: events.docs, verse }
  } catch {
    return { stories: [], events: [], verse: fallbackVerse }
  }
}

const primaryButton =
  'inline-flex h-12 items-center rounded-lg bg-brand px-5 font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.98]'
const textLink = 'font-medium text-brand transition-colors duration-150 ease-out hover:text-brand-hover'

function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <h2 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className={`shrink-0 text-sm ${textLink}`}>
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
  const { stories, events, verse } = await getHomeContent(locale as 'rw' | 'en')
  const dateFormat = new Intl.DateTimeFormat(locale === 'rw' ? 'rw-RW' : 'en-GB', { dateStyle: 'long' })

  return (
    <>
      {/* Hero: the promise on the left, today's verse as the page's one bright moment on the right. */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-24 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8 md:pt-28 md:pb-32">
        <div>
          <h1 className="font-serif text-[40px] leading-[1.06] font-normal tracking-[-0.02em] md:text-[60px] md:tracking-[-0.03em]">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg leading-7 text-secondary">{t('heroText')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/ibyo-dukora" className={primaryButton}>
              {t('explore')}
            </Link>
            <Link href="/fasha-umurimo" className={textLink}>
              {tNav('give')} →
            </Link>
          </div>
        </div>

        {/* Verse of the day, set like a page with a bookmark ribbon. Changes at 00:00 CAT; see lib/verseOfTheDay. */}
        <figure className="relative rounded-2xl border border-line bg-card px-8 pt-12 pb-10 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:px-10 md:pt-14">
          <span
            aria-hidden="true"
            className="absolute -top-px right-10 h-16 w-4 bg-gold [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"
          />
          <p className="text-sm text-muted">{t('verseTitle')}</p>
          <blockquote className="mt-4 font-serif text-2xl leading-[1.4] md:text-[28px]">{verse.text}</blockquote>
          <figcaption className="mt-6 font-serif text-lg text-secondary">{verse.reference}</figcaption>
        </figure>
      </section>

      {/* Ibyo dukora */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="border-t border-line py-20 md:py-24">
          <SectionHeading title={tNav('whatWeDo')} href="/ibyo-dukora" linkLabel={t('viewAll')} />
          {stories.length === 0 ? (
            <p className="text-secondary">{t('storiesEmpty')}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((story) => {
                const cover = typeof story.cover === 'object' ? (story.cover as Media) : null
                const image = cover?.sizes?.card?.url ?? cover?.url
                return (
                  <article key={story.id} className="group overflow-hidden rounded-2xl border border-line bg-card">
                    {image && (
                      <Image
                        src={image}
                        alt={cover?.alt ?? ''}
                        width={800}
                        height={600}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <time className="text-sm text-muted tabular-nums" dateTime={story.publishedAt}>
                        {dateFormat.format(new Date(story.publishedAt))}
                      </time>
                      <h3 className="mt-2 font-serif text-xl leading-snug">
                        <Link
                          href={`/ibyo-dukora/${story.slug}`}
                          className="transition-colors duration-150 group-hover:text-brand"
                        >
                          {story.title}
                        </Link>
                      </h3>
                      {story.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-5 text-secondary">{story.excerpt}</p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Get help: the two services the pastor offers, and one way to ask for a session. */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid gap-8 rounded-2xl border border-line bg-card p-8 md:grid-cols-2 md:gap-16 md:p-12">
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">{t('helpTitle')}</h2>
            <p className="mt-3 text-secondary">{t('helpText')}</p>
          </div>
          <div>
            <ul className="border-t border-line">
              {(['familyTherapy', 'advisory'] as const).map((key) => (
                <li key={key} className="flex h-14 items-center border-b border-line">
                  {tNav(key)}
                </li>
              ))}
            </ul>
            <Link href="/saba-umwanya" className={`mt-8 ${primaryButton}`}>
              {tNav('book')}
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <SectionHeading title={tNav('events')} href="/gahunda" linkLabel={t('viewAll')} />
        {events.length === 0 ? (
          <p className="text-secondary">{t('eventsEmpty')}</p>
        ) : (
          <ul className="border-t border-line">
            {events.map((event) => (
              <li
                key={event.id}
                className="grid gap-1 border-b border-line py-5 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-6"
              >
                <time className="text-sm text-muted tabular-nums" dateTime={event.startsAt}>
                  {dateFormat.format(new Date(event.startsAt))}
                </time>
                <div>
                  <p className="font-serif text-xl leading-snug">{event.title}</p>
                  <p className="text-sm text-secondary">{event.venue}</p>
                </div>
                <Link href={`/gahunda/${event.slug}`} className={`text-sm ${textLink}`}>
                  {tNav('register')} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Fasha umurimo */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-raised p-8 md:p-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">{tNav('give')}</h2>
            <p className="mt-3 max-w-[36rem] text-secondary">{t('giveText')}</p>
          </div>
          <Link href="/fasha-umurimo" className={primaryButton}>
            {tNav('give')}
          </Link>
        </div>
      </section>
    </>
  )
}
