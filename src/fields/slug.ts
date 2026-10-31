import type { Field, FieldHook } from 'payload'

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const fillSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[fallbackField]
    // Localized fields arrive as a string for the locale being edited.
    return typeof source === 'string' ? slugify(source) : value
  }

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Used in the page address. Filled in from the title if left empty.',
  },
  hooks: { beforeValidate: [fillSlug(fallbackField)] },
})
