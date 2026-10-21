import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
      <div className="mb-10 grid items-end gap-7 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary"><span className="size-2 rounded-full bg-primary" aria-hidden="true" /> EVERYDAY, REIMAGINED</p>
          <h1 id="hero-heading" className="text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-primary">DISCOVER MORE.<br />SHOP BETTER.</h1>
        </div>
        <div className="lg:pb-1">
          <p className="max-w-md text-base leading-7 text-foreground/75">Your world, with more possibilities. Explore style, technology, and everyday living in one place.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-primary hover:text-primary-foreground">Explore Products <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/categories" className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary hover:bg-secondary">Shop by Category</Link>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
        <Image src="/assets/images/Sunlit Terrace Lifestyle Scene.png" alt="Sunlit terrace with a laptop, headphones, sneakers, and folded clothing arranged on a stone table" width={1983} height={793} sizes="(max-width: 1280px) 100vw, 1184px" className="h-auto w-full" priority />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-primary/75"><p>A little inspiration for your everyday.</p><a href="#categories" className="flex min-h-10 items-center gap-2 rounded-sm">Explore Nexa <ArrowDown size={14} aria-hidden="true" /></a></div>
    </section>
  );
}
