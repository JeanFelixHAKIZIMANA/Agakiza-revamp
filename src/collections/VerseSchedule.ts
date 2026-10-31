import type { CollectionConfig } from 'payload'

import { loggedIn } from '@/access'
import { kigaliDay } from '@/lib/kigaliDate'

// One entry per day. Entries are created automatically when a day starts;
// an admin can create or edit the entry for any day to choose its verse.
export const VerseSchedule: CollectionConfig = {
  slug: 'verse-schedule',
  labels: { singular: 'Scheduled verse', plural: 'Verse schedule' },
  admin: {
    useAsTitle: 'day',
    defaultColumns: ['day', 'verse', 'source'],
    group: "Ijambo ry'umunsi",
    description: 'Which verse appears on which day. Change an entry to override the automatic pick for that day.',
  },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: '-day',
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    {
      // The calendar day in Kigali, derived from `date`. Unique, so a day can
      // never have two verses.
      name: 'day',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    { name: 'verse', type: 'relationship', relationTo: 'verses', required: true },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Picked automatically', value: 'auto' },
        { label: 'Chosen by admin', value: 'manual' },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, context }) => {
        if (data.date) data.day = kigaliDay(new Date(data.date))
        // Any change made by a person in the admin is an override.
        if (req.user && !context.autoPick) data.source = 'manual'
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context.autoPick) return
        const verseId = typeof doc.verse === 'object' ? doc.verse.id : doc.verse
        const previousId = typeof previousDoc?.verse === 'object' ? previousDoc.verse?.id : previousDoc?.verse
        if (verseId === previousId) return
        await req.payload.update({
          collection: 'verses',
          id: verseId,
          data: { lastShownOn: doc.day },
          req,
          overrideAccess: true,
        })
      },
    ],
  },
}
