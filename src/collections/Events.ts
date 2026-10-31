import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events (Gahunda ziteganyijwe)' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'startsAt', 'venue', '_status'] },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  defaultSort: 'startsAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'poster', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'venue', type: 'text', required: true },
    { name: 'mapUrl', type: 'text', label: 'Google Maps link' },
    {
      type: 'row',
      fields: [
        { name: 'registrationOpen', type: 'checkbox', defaultValue: true },
        {
          name: 'capacity',
          type: 'number',
          min: 1,
          admin: { description: 'Leave empty for no limit.' },
        },
      ],
    },
    slugField(),
  ],
}
