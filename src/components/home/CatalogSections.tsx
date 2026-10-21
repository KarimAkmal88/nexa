import Link from "next/link";
import { ArrowUpRight, LayoutGrid, ShoppingBag } from "lucide-react";
import type { CategoryI } from "@/interfaces/category";
import type { ProductI } from "@/interfaces/product";
import CategoryCard from "@/components/home/CategoryCard";
import ProductCard from "@/components/product/ProductCard";

export function CategorySection({ categories = [] }: { categories?: CategoryI[] }) {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="border-y bg-card">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-18">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary/70">FOLLOW YOUR CURIOSITY</p><h2 id="categories-heading" className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Shop by category</h2></div>
          <Link href="/categories" className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-primary hover:underline">Explore categories <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        {categories.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{categories.map(category => <CategoryCard key={category._id} category={category} />)}</div> : <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-8 text-center"><LayoutGrid className="mb-4 text-primary/60" size={28} aria-hidden="true" /><p className="font-medium text-primary">More to explore</p><p className="mt-2 max-w-sm text-sm leading-6 text-foreground/70">Categories will appear here when the collection is available.</p></div>}
      </div>
    </section>
  );
}

export function FeaturedProducts({ products = [] }: { products?: ProductI[] }) {
  return (
    <section aria-labelledby="products-heading" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12 lg:pt-18">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary/70">YOUR NEXT DISCOVERY</p><h2 id="products-heading" className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Featured products</h2></div>
        <Link href="/products" className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-primary hover:underline">View all products <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      {products.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product => <ProductCard key={product._id} product={product} />)}</div> : <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center"><ShoppingBag className="mb-4 text-primary/60" size={30} aria-hidden="true" /><p className="font-medium text-primary">A space for your next favorite</p><p className="mt-2 max-w-sm text-sm leading-6 text-foreground/70">Featured products will appear here when available. In the meantime, take a look around.</p><Link href="/products" className="mt-5 rounded-sm text-sm font-semibold text-primary underline underline-offset-4">Explore products</Link></div>}
    </section>
  );
}
