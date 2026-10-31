import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Bookings } from './collections/Bookings'
import { EventRegistrations } from './collections/EventRegistrations'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Stories } from './collections/Stories'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { Verses } from './collections/Verses'
import { VerseSchedule } from './collections/VerseSchedule'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Agakiza admin' },
  },
  collections: [
    Stories,
    Events,
    EventRegistrations,
    Bookings,
    Messages,
    Subscribers,
    Verses,
    VerseSchedule,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  localization: {
    locales: [
      { label: 'Kinyarwanda', code: 'rw' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'rw',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Production applies schema changes through src/migrations (`pnpm migrate`),
    // which the start script runs before the server boots.
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
})
