import type { ProductI } from "@/interfaces/product";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "@/components/product/AddToCartBtn";

export default function ProductCard({ product, currency = "EGP" }: { product: ProductI; currency?: string }) {
  const discounted = product.priceAfterDiscount != null && product.priceAfterDiscount < product.price;
  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border bg-card h-full transition-shadow hover:shadow-xs">
      <Link href={`/products/${encodeURIComponent(product._id)}`} className="group flex flex-col flex-1">
        <div className="relative aspect-square bg-muted">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6"
            unoptimized
          />
        </div>
        <div className="space-y-3 p-5 flex-1">
          <h3 className="line-clamp-2 font-medium leading-6 h-12 text-primary group-hover:underline">
            {product.title}
          </h3>
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-primary">
            <span>{discounted ? product.priceAfterDiscount : product.price}{currency && ` ${currency}`}</span>
            {discounted && (
              <del className="text-xs font-normal text-foreground/65">
                <span className="sr-only">Original price: </span>{product.price}{currency && ` ${currency}`}
              </del>
            )}
          </p>
          {product.ratingsQuantity > 0 && product.ratingsAverage > 0 ? (
            <p className="flex items-center gap-2 text-xs text-foreground/75">
              <Star size={14} className="fill-primary text-primary" aria-hidden="true" />
              <span>{product.ratingsAverage} out of 5 ({product.ratingsQuantity} reviews)</span>
            </p>
          ) : (
            <p className="flex items-center gap-2 text-xs text-foreground/75">No reviews yet</p>
          )}
        </div>
      </Link>
      <div className="p-5 pt-0">
        <AddToCartBtn productId={product._id} className="w-full rounded-xl py-2" />
      </div>
    </article>
  );
}
