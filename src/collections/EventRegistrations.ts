import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { addSubscriber } from '@/hooks/addSubscriber'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: { singular: 'Registration', plural: 'Event registrations' },
  admin: { useAsTitle: 'names', defaultColumns: ['names', 'event', 'phone', 'createdAt'] },
  access: { create: anyone, read: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'names', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'attendants', type: 'number', min: 1, defaultValue: 1 },
    { name: 'subscribe', type: 'checkbox', defaultValue: false },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.subscribe) {
          await addSubscriber(req.payload, {
            email: doc.email,
            name: doc.names,
            source: 'event',
            locale: req.locale ?? undefined,
          })
        }
      },
    ],
  },
}
