import type { CollectionConfig } from 'payload'

import { loggedIn } from '@/access'

// The mailing list used to send the gospel by email. Everyone here gave consent.
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'source', 'status', 'createdAt'] },
  // Public signups go through a server action that calls addSubscriber, so
  // the REST endpoint itself stays closed to visitors.
  access: { create: loggedIn, read: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'name', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'subscribed',
          options: [
            { label: 'Subscribed', value: 'subscribed' },
            { label: 'Unsubscribed', value: 'unsubscribed' },
          ],
        },
        {
          name: 'locale',
          type: 'select',
          defaultValue: 'rw',
          options: [
            { label: 'Kinyarwanda', value: 'rw' },
            { label: 'English', value: 'en' },
          ],
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Newsletter form', value: 'newsletter' },
            { label: 'Contact form', value: 'contact' },
            { label: 'Booking', value: 'booking' },
            { label: 'Event registration', value: 'event' },
            { label: 'Added by staff', value: 'manual' },
          ],
        },
      ],
    },
    { name: 'consentAt', type: 'date', admin: { readOnly: true } },
  ],
}
