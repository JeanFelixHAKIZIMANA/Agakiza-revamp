import type { CollectionConfig } from 'payload'

import { loggedIn } from '@/access'

// The inventory of scriptures the verse of the day is picked from.
export const Verses: CollectionConfig = {
  slug: 'verses',
  labels: { singular: 'Verse', plural: "Verse inventory (Ijambo ry'umunsi)" },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'active', 'lastShownOn', 'timesShown'],
    group: "Ijambo ry'umunsi",
    description: 'Scriptures waiting to be shared. Each day at 00:00 CAT one is picked automatically, starting with those shown least recently.',
  },
  access: { read: loggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'text', type: 'textarea', required: true, localized: true },
    {
      name: 'reference',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Book, chapter and verse, for example Yohana 3:16.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Untick to keep the verse out of the automatic picks.' },
    },
    {
      name: 'lastShownOn',
      type: 'text',
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Last day (CAT) this verse was the verse of the day.' },
    },
    {
      name: 'timesShown',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
