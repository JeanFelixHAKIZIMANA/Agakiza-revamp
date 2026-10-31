import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: { format: 'webp', options: { quality: 80 } },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Describe the picture for people using screen readers and for Google.' },
    },
  ],
}
