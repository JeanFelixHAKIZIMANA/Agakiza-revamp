import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide the floating "N" badge Next.js shows in development.
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.youtube.com' }],
  },
}

export default withPayload(withNextIntl(nextConfig))
