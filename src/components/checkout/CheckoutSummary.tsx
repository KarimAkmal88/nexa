"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CheckoutSummaryProps {
  currency?: string;
}

export default function CheckoutSummary({
  currency = "EGP",
}: CheckoutSummaryProps) {
  const { cart, totalCartPrice, numOfCartItems } = useCart();
  const products = cart?.products ?? [];

  return (
    <aside
      aria-label="Checkout order summary"
      className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-card p-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Order Summary
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary">
          {numOfCartItems} {numOfCartItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Cart items preview */}
      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
        {products.map((item) => {
          const product = item.product;
          return (
            <div
              key={item._id}
              className="pt-3 first:pt-0 flex items-center gap-3"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                {product?.imageCover ? (
                  <Image
                    src={product.imageCover}
                    alt={product.title || "Product"}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ShoppingBag className="size-5" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-1">
                  {product?.title || "Product"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {item.count} × {(item.price ?? 0).toLocaleString()} {currency}
                </p>
              </div>
              <div className="text-xs font-semibold text-primary shrink-0">
                {((item.count ?? 0) * (item.price ?? 0)).toLocaleString()} {currency}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing breakdown */}
      <dl className="space-y-3 border-t border-neutral-200 pt-4 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <dt>Subtotal</dt>
          <dd className="font-medium text-foreground">
            {(totalCartPrice ?? 0).toLocaleString()} {currency}
          </dd>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <dt>Shipping</dt>
          <dd className="font-medium text-emerald-600">Free</dd>
        </div>

        <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
          <dt className="text-base font-semibold text-foreground">Total Due</dt>
          <dd className="text-xl font-bold text-primary">
            {(totalCartPrice ?? 0).toLocaleString()} {currency}
          </dd>
        </div>
      </dl>

      {/* Trust & Guarantee badge */}
      <div className="flex items-center gap-2.5 rounded-xl bg-neutral-50 p-3 text-xs text-muted-foreground border border-neutral-200">
        <ShieldCheck className="size-5 text-emerald-600 shrink-0" aria-hidden="true" />
        <p>
          Guaranteed safe & secure checkout powered by Route API and Stripe.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/cart"
          className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Edit items in cart
        </Link>
      </div>
    </aside>
  );
}
