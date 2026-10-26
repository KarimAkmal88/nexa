
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ProductI } from "@/interfaces/product";

export default function ProductCard({ product, currency = "EGP" }: { product: ProductI; currency?: string }) {
  const discounted = product.priceAfterDiscount != null && product.priceAfterDiscount < product.price;
  return (
    <article className="overflow-hidden rounded-2xl border bg-card">
      <Link href={`/products/${encodeURIComponent(product._id)}`} className="group block rounded-2xl">
        <div className="relative aspect-square bg-muted"><Image src={product.imageCover} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain p-6" unoptimized /></div>
        <div className="space-y-3 p-5">
          <h3 className="line-clamp-2 font-medium leading-6 text-primary group-hover:underline">{product.title}</h3>
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary"><span>{discounted ? product.priceAfterDiscount : product.price}{currency && ` ${currency}`}</span>{discounted && <del className="text-xs font-normal text-foreground/65"><span className="sr-only">Original price: </span>{product.price}{currency && ` ${currency}`}</del>}</p>
          {product.ratingsQuantity > 0 && product.ratingsAverage > 0 && <p className="flex items-center gap-2 text-xs text-foreground/75"><Star size={14} className="fill-primary text-primary" aria-hidden="true" /><span>{product.ratingsAverage} out of 5 ({product.ratingsQuantity} reviews)</span></p>}
        </div>
      </Link>
    </article>
  );
}
