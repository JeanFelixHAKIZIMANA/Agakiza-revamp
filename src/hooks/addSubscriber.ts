import type { Payload } from 'payload'

type Source = 'newsletter' | 'contact' | 'booking' | 'event'

// Adds (or re-activates) a mailing-list subscriber. Only call this when the
// person ticked the consent box, as Rwanda's data protection law requires.
export async function addSubscriber(
  payload: Payload,
  { email, name, source, locale }: { email: string; name?: string; source: Source; locale?: string },
): Promise<void> {
  const normalized = email.trim().toLowerCase()
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: normalized } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    if (existing.docs[0].status !== 'subscribed') {
      await payload.update({
        collection: 'subscribers',
        id: existing.docs[0].id,
        data: { status: 'subscribed', consentAt: new Date().toISOString() },
        overrideAccess: true,
      })
    }
    return
  }

  await payload.create({
    collection: 'subscribers',
    data: {
      email: normalized,
      name,
      source,
      locale: locale === 'en' ? 'en' : 'rw',
      status: 'subscribed',
      consentAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })
}
