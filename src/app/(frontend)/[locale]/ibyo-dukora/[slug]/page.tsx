import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cache } from 'react'

import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { Link } from '@/i18n/navigation'
import { longDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { alternates } from '@/lib/seo'
import { siteUrl } from '@/lib/site'
import type { Media } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

export const dynamic = 'force-dynamic'

const getStory = cache(async (slug: string, locale: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'stories',
    locale: locale as 'rw' | 'en',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

const media = (value: unknown): Media | null => (value && typeof value === 'object' ? (value as Media) : null)

const absolute = (url: string | null | undefined) => (url ? new URL(url, siteUrl).toString() : undefined)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const story = await getStory(slug, locale)
  if (!story) return {}
  const cover = media(story.cover)
  const image = absolute(cover?.sizes?.hero?.url ?? cover?.url)
  return {
    title: story.title,
    description: story.excerpt ?? undefined,
    alternates: alternates(locale, `/ibyo-dukora/${slug}`),
    openGraph: {
      type: 'article',
      title: story.title,
      description: story.excerpt ?? undefined,
      publishedTime: story.publishedAt,
      images: image ? [{ url: image, alt: cover?.alt ?? '' }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary' },
  }
}

export default async function StoryPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const story = await getStory(slug, locale)
  if (!story) notFound()

  const t = await getTranslations('stories')
  const tNav = await getTranslations('nav')
  const cover = media(story.cover)
  const coverUrl = cover?.sizes?.hero?.url ?? cover?.url
  const gallery = (story.gallery ?? []).map(media).filter((item): item is Media => Boolean(item?.url))

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.excerpt ?? undefined,
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    image: absolute(coverUrl),
    inLanguage: locale,
    mainEntityOfPage: `${siteUrl}/${locale}/ibyo-dukora/${slug}`,
    publisher: { '@type': 'Organization', name: 'Agakiza', url: siteUrl },
  }

  return (
    <article className="pb-24">
      <header className="mx-auto max-w-3xl px-4 pt-12 md:px-8 md:pt-20">
        <Link href="/ibyo-dukora" className="text-sm font-medium text-brand transition-colors duration-150 hover:text-brand-hover">
          ← {t('allStories')}
        </Link>
        <h1 className="mt-6 font-serif text-[36px] leading-[1.08] tracking-[-0.02em] md:text-[52px] md:tracking-[-0.03em]">
          {story.title}
        </h1>
        <p className="mt-4 text-sm text-muted tabular-nums">
          <time dateTime={story.publishedAt}>{longDate(locale).format(new Date(story.publishedAt))}</time>
          {story.section && <> · {tNav(sectionKey[story.section])}</>}
        </p>
        {story.excerpt && <p className="mt-6 text-lg leading-7 text-secondary">{story.excerpt}</p>}
      </header>

      {coverUrl && (
        <div className="mx-auto mt-10 max-w-5xl px-4 md:px-8">
          <Image
            src={coverUrl}
            alt={cover?.alt ?? ''}
            width={cover?.sizes?.hero?.width ?? cover?.width ?? 1920}
            height={cover?.sizes?.hero?.height ?? cover?.height ?? 1080}
            priority
            className="w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl space-y-12 px-4 md:px-8">
        {story.body && <RichText data={story.body} className="rich-text" />}

        {story.youtubeUrl && (
          <section aria-label={t('watchVideo')}>
            <h2 className="mb-4 font-serif text-2xl">{t('watchVideo')}</h2>
            <YouTubeEmbed url={story.youtubeUrl} title={story.title} />
          </section>
        )}

        {gallery.length > 0 && (
          <section aria-label={t('photos')}>
            <h2 className="mb-4 font-serif text-2xl">{t('photos')}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((photo) => (
                <a key={photo.id} href={photo.url ?? undefined} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={photo.sizes?.card?.url ?? photo.url ?? ''}
                    alt={photo.alt}
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full rounded-xl object-cover"
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
    </article>
  )
}

const sectionKey: Record<string, string> = {
  amahugurwa: 'training',
  umuryango: 'family',
  isanamitima: 'innerHealing',
  amakuru: 'news',
}
