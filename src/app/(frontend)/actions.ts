'use server'

import { addSubscriber } from '@/hooks/addSubscriber'
import { getPayloadClient } from '@/lib/payload'

export type SubscribeState = { status: 'idle' | 'success' | 'error' }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Bots fill the hidden field; pretend it worked so they move on.
  if (formData.get('website')) return { status: 'success' }

  const email = String(formData.get('email') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim() || undefined
  const locale = String(formData.get('locale') ?? 'rw')
  if (!emailPattern.test(email)) return { status: 'error' }

  try {
    const payload = await getPayloadClient()
    await addSubscriber(payload, { email, name, source: 'newsletter', locale })
    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
