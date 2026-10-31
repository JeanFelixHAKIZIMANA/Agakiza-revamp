import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { StoryCard } from '@/components/StoryCard'
import { Link } from '@/i18n/navigation'
import { longDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { alternates } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

const PER_PAGE = 12

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tStories = await getTranslations({ locale, namespace: 'stories' })
  return { title: t('whatWeDo'), description: tStories('intro'), alternates: alternates(locale, '/ibyo-dukora') }
}

export default async function StoriesPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const t = await getTranslations('stories')
  const tNav = await getTranslations('nav')
  const tHome = await getTranslations('home')

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    locale: locale as 'rw' | 'en',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: PER_PAGE,
    page,
  })
  const dateFormat = longDate(locale)

  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-24 md:px-8 md:pt-24">
      <h1 className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-[56px] md:tracking-[-0.03em]">
        {tNav('whatWeDo')}
      </h1>
      <p className="mt-4 max-w-[36rem] text-lg leading-7 text-secondary">{t('intro')}</p>

      <div className="mt-12">
        {result.docs.length === 0 ? (
          <p className="text-secondary">{tHome('storiesEmpty')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((story) => (
              <StoryCard key={story.id} story={story} dateFormat={dateFormat} />
            ))}
          </div>
        )}
      </div>

      {result.totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-between border-t border-line pt-6 text-sm">
          {result.hasPrevPage ? (
            <Link href={{ pathname: '/ibyo-dukora', query: { page: page - 1 } }} className="font-medium text-brand hover:text-brand-hover">
              ← {t('previous')}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted tabular-nums">
            {result.page} / {result.totalPages}
          </span>
          {result.hasNextPage ? (
            <Link href={{ pathname: '/ibyo-dukora', query: { page: page + 1 } }} className="font-medium text-brand hover:text-brand-hover">
              {t('next')} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  )
}
