import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { knownPages } from '@/lib/navigation'
import { alternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string[] }> }

// Placeholder for pages in the navigation that aren't built yet, so no link
// on the site is dead. Each real page replaces its entry with its own route
// and is listed in `builtPages`.
const builtPages = new Set(['/ibyo-dukora'])
const placeholderPages = Object.keys(knownPages).filter((path) => !builtPages.has(path))

export function generateStaticParams() {
  return placeholderPages.map((path) => ({ slug: path.slice(1).split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const path = `/${slug.join('/')}`
  const key = knownPages[path]
  if (!key) return {}
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t(key), alternates: alternates(locale, path), robots: { index: false } }
}

export default async function PlaceholderPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const key = knownPages[`/${slug.join('/')}`]
  if (!key) notFound()

  const t = await getTranslations('nav')
  const tPage = await getTranslations('page')

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <h1 className="font-serif text-4xl leading-tight md:text-5xl">{t(key)}</h1>
      <p className="mt-4 max-w-xl text-secondary">{tPage('comingSoon')}</p>
    </section>
  )
}
