import type { SiteSetting } from '@/payload-types'

import { getPayloadClient } from './payload'

// Site settings are optional during setup, so a missing database or empty
// global shouldn't take the public site down.
export async function getSiteSettings(locale: string): Promise<SiteSetting | null> {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'site-settings', locale: locale as 'rw' | 'en' })
  } catch {
    return null
  }
}
