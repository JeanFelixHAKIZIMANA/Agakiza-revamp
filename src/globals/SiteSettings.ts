import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      admin: { description: 'International format without + or spaces, for example 250788000000.' },
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'text', localized: true },
    {
      name: 'socials',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['facebook', 'youtube', 'instagram', 'x', 'tiktok', 'linkedin'].map((value) => ({
            label: value === 'x' ? 'X (Twitter)' : value[0].toUpperCase() + value.slice(1),
            value,
          })),
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'bank',
      type: 'group',
      label: 'Bank details (shown on the Fasha umurimo page)',
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        { name: 'swift', type: 'text' },
      ],
    },
  ],
}
