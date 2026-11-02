import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'

const webp = { format: 'webp', options: { quality: 80 } } as const

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: webp,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: webp },
      { name: 'card', width: 800, height: 600, position: 'centre', formatOptions: webp },
      { name: 'hero', width: 1920, height: undefined, formatOptions: webp },
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
