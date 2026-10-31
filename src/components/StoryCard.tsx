import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { Media, Story } from '@/payload-types'

export function StoryCard({ story, dateFormat }: { story: Story; dateFormat: Intl.DateTimeFormat }) {
  const cover = typeof story.cover === 'object' ? (story.cover as Media) : null
  const image = cover?.sizes?.card?.url ?? cover?.url

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-card">
      {image && (
        <Image src={image} alt={cover?.alt ?? ''} width={800} height={600} className="aspect-[4/3] w-full object-cover" />
      )}
      <div className="p-6">
        <time className="text-sm text-muted tabular-nums" dateTime={story.publishedAt}>
          {dateFormat.format(new Date(story.publishedAt))}
        </time>
        <h3 className="mt-2 font-serif text-xl leading-snug">
          <Link href={`/ibyo-dukora/${story.slug}`} className="transition-colors duration-150 group-hover:text-brand">
            {story.title}
          </Link>
        </h3>
        {story.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-5 text-secondary">{story.excerpt}</p>}
      </div>
    </article>
  )
}
