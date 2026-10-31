import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, loggedIn } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'] },
  auth: true,
  access: {
    read: loggedIn,
    create: isAdmin,
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
