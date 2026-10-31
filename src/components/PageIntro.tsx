import type { ReactNode } from 'react'

// Title and intro on the left, the page's main content (usually a form) on the right.
export function SplitPage({ title, intro, aside, children }: { title: string; intro: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-24 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-8 md:pt-24">
      <div>
        <h1 className="font-serif text-[40px] leading-[1.06] tracking-[-0.02em] md:text-[56px] md:tracking-[-0.03em]">{title}</h1>
        <p className="mt-4 max-w-[36rem] text-lg leading-7 text-secondary">{intro}</p>
        {aside}
      </div>
      <div className="rounded-2xl border border-line bg-card p-6 md:p-10">{children}</div>
    </section>
  )
}
