import type { Payload } from 'payload'

import type { Verse } from '@/payload-types'

import { kigaliDay } from './kigaliDate'

export type DailyVerse = { text: string; reference: string }

type Locale = 'rw' | 'en'

// Shown only while the inventory is empty.
export const fallbackVerse: DailyVerse = {
  text: "Nawe Betelehemu ho mu gihugu cya Yuda, ni ukuri nturi mutoya mu midugudu ikomeye ya Yuda, kuko muri wowe ari ho hazaturuka umutware, uzaragira ubwoko bwanjye bw'Abisirayeli",
  reference: 'Matayo 2:6',
}

const toDailyVerse = (verse: Verse | number | null | undefined): DailyVerse | null =>
  verse && typeof verse === 'object' ? { text: verse.text, reference: verse.reference } : null

async function findScheduled(payload: Payload, day: string, locale: Locale) {
  const { docs } = await payload.find({
    collection: 'verse-schedule',
    where: { day: { equals: day } },
    limit: 1,
    depth: 1,
    locale,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

// Never-shown verses first (in random order), then the one shown longest ago.
async function pickVerse(payload: Payload): Promise<Verse | null> {
  const neverShown = await payload.find({
    collection: 'verses',
    where: { active: { equals: true }, lastShownOn: { exists: false } },
    limit: 100,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  if (neverShown.docs.length > 0) {
    return neverShown.docs[Math.floor(Math.random() * neverShown.docs.length)]
  }
  const oldest = await payload.find({
    collection: 'verses',
    where: { active: { equals: true } },
    sort: 'lastShownOn',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return oldest.docs[0] ?? null
}

/**
 * The verse for the current day in Kigali. The first request after 00:00 CAT
 * picks a verse from the inventory and stores it in the schedule, so it stays
 * the same for the whole day unless an admin changes that day's entry.
 */
export async function getVerseOfTheDay(payload: Payload, locale: Locale, now: Date = new Date()): Promise<DailyVerse> {
  const day = kigaliDay(now)

  const scheduled = await findScheduled(payload, day, locale)
  if (scheduled) return toDailyVerse(scheduled.verse) ?? fallbackVerse

  const verse = await pickVerse(payload)
  if (!verse) return fallbackVerse

  try {
    await payload.create({
      collection: 'verse-schedule',
      data: { date: `${day}T12:00:00.000Z`, verse: verse.id, source: 'auto' },
      context: { autoPick: true },
      overrideAccess: true,
    })
    await payload.update({
      collection: 'verses',
      id: verse.id,
      data: { lastShownOn: day, timesShown: (verse.timesShown ?? 0) + 1 },
      overrideAccess: true,
    })
  } catch {
    // Another request picked today's verse at the same moment; use theirs.
  }

  const stored = await findScheduled(payload, day, locale)
  return toDailyVerse(stored?.verse) ?? fallbackVerse
}
