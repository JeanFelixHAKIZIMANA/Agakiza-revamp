import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields/slug'
import { sections } from '@/lib/sections'

// "Ibyo dukora": stories about the ministry's work, each with a photo and an
// optional YouTube video recorded at the event.
export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: { singular: 'Story', plural: 'Stories (Ibyo dukora)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'publishedAt', '_status'],
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 240,
      admin: { description: 'Short summary shown on cards and in Google results.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'body', type: 'richText', localized: true },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube video link',
      validate: (value: string | null | undefined) =>
        !value || /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(value) || 'Must be a YouTube link',
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    slugField(),
    {
      name: 'section',
      type: 'select',
      options: [...sections],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
