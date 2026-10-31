import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { addSubscriber } from '@/hooks/addSubscriber'

// The "Twandikire" (contact us) inbox.
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages (Twandikire)' },
  admin: { useAsTitle: 'names', defaultColumns: ['names', 'email', 'read', 'createdAt'] },
  access: { create: anyone, read: loggedIn, update: loggedIn, delete: loggedIn },
  defaultSort: '-createdAt',
  fields: [
    { name: 'names', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true, maxLength: 5000 },
    { name: 'subscribe', type: 'checkbox', defaultValue: false },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      access: { create: () => false },
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.subscribe) {
          await addSubscriber(req.payload, {
            email: doc.email,
            name: doc.names,
            source: 'contact',
            locale: req.locale ?? undefined,
          })
        }
      },
    ],
  },
}
