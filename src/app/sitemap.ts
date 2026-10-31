import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: `${siteUrl}/${routing.defaultLocale}${path}`,
  lastModified,
  alternates: {
    languages: Object.fromEntries(routing.locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])),
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [entry('')]
  try {
    const payload = await getPayloadClient()
    const stories = await payload.find({
      collection: 'stories',
      limit: 1000,
      depth: 0,
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
    })
    for (const story of stories.docs) entries.push(entry(`/ibyo-dukora/${story.slug}`, story.updatedAt))
  } catch {
    // Database unavailable: serve the static entries only.
  }
  return entries
}
