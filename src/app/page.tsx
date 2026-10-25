import { CategorySection, FeaturedProducts } from "@/components/home/CatalogSections";
import Hero from "@/components/home/Hero";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <section aria-labelledby="discover-heading" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-7 rounded-3xl bg-secondary p-8 sm:items-center lg:flex-row lg:p-12">
          <div><p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary">MAKE ROOM FOR DISCOVERY</p><h2 id="discover-heading" className="text-3xl font-semibold tracking-tight text-primary">Find your next everyday favorite.</h2></div>
          <Link href="/brands" className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">Explore Brands <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
