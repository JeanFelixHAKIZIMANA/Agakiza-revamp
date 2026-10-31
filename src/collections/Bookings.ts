import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { addSubscriber } from '@/hooks/addSubscriber'
import { notifyPastor } from '@/hooks/notifyPastor'

// Family therapy (Ibiganiro by'umuryango) and advisory (Ubujyanama) requests.
// Only the pastor approves or rejects them.
export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'names',
    defaultColumns: ['names', 'type', 'preferredDate', 'status', 'createdAt'],
  },
  access: { create: anyone, read: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: "Family therapy (Ibiganiro by'umuryango)", value: 'family-therapy' },
        { label: 'Advisory (Ubujyanama)', value: 'advisory' },
      ],
    },
    { name: 'names', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'attendants', label: 'Number of attendants', type: 'number', required: true, min: 1 },
        { name: 'location', type: 'text', required: true },
      ],
    },
    { name: 'preferredDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'note', type: 'textarea' },
    { name: 'subscribe', type: 'checkbox', defaultValue: false },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      // Visitors can't set their own booking status.
      access: { create: () => false },
      options: [
        { label: 'Pending (Tegereza igisubizo)', value: 'pending' },
        { label: 'Approved (Byemejwe)', value: 'approved' },
        { label: 'Rejected (Ntabwo byemejwe)', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        await notifyPastor(req.payload, doc)
        if (doc.subscribe) {
          await addSubscriber(req.payload, {
            email: doc.email,
            name: doc.names,
            source: 'booking',
            locale: req.locale ?? undefined,
          })
        }
      },
    ],
  },
}
