"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Star, Trash2 } from "lucide-react";
import type { ProductI } from "@/interfaces/product";
import AddToCartBtn from "@/components/product/AddToCartBtn";
import { useWishlist } from "@/contexts/WishlistContext";

interface WishlistItemCardProps {
  product: ProductI;
  currency?: string;
}

export default function WishlistItemCard({
  product,
  currency = "EGP",
}: WishlistItemCardProps) {
  const { removeFromWishlist, isMutatingId } = useWishlist();
  const isRemoving = isMutatingId(product._id);

  const discounted =
    product.priceAfterDiscount != null &&
    product.priceAfterDiscount < product.price;

  const handleRemove = async () => {
    if (isRemoving) return;
    await removeFromWishlist(product._id);
  };

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-card transition-shadow hover:shadow-xs h-full">
      <div className="flex flex-col flex-1">
        <Link
          href={`/products/${encodeURIComponent(product._id)}`}
          className="group relative aspect-square bg-muted block overflow-hidden"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6 transition-transform group-hover:scale-105"
            unoptimized
          />
        </Link>

        <div className="space-y-3 p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            {product.category?.name && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <Link
              href={`/products/${encodeURIComponent(product._id)}`}
              className="line-clamp-2 font-medium leading-6 text-primary hover:underline block"
            >
              {product.title}
            </Link>
          </div>

          <div className="space-y-2">
            <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-primary">
              <span>
                {discounted ? product.priceAfterDiscount : product.price}
                {currency && ` ${currency}`}
              </span>
              {discounted && (
                <del className="text-xs font-normal text-muted-foreground">
                  <span className="sr-only">Original price: </span>
                  {product.price}
                  {currency && ` ${currency}`}
                </del>
              )}
            </p>

            {product.ratingsAverage > 0 ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star
                  size={14}
                  className="fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="font-medium text-foreground">
                  {product.ratingsAverage.toFixed(1)}
                </span>
                {product.ratingsQuantity > 0 && (
                  <span>({product.ratingsQuantity})</span>
                )}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 space-y-2">
        <AddToCartBtn
          productId={product._id}
          className="w-full rounded-xl py-2"
        />
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label={`Remove ${product.title} from wishlist`}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2 text-xs font-medium text-neutral-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              <span>Removing...</span>
            </>
          ) : (
            <>
              <Trash2 className="size-3.5" aria-hidden="true" />
              <span>Remove from Wishlist</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
