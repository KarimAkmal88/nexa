"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartSummaryProps {
  currency?: string;
}

export default function CartSummary({ currency = "EGP" }: CartSummaryProps) {
  const { totalCartPrice, numOfCartItems, clearCart, isMutating } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    if (isClearing || isMutating) return;
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart? All items will be removed."
    );
    if (!confirmed) return;

    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
  };

  return (
    <aside
      aria-label="Order summary"
      className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs"
    >
      <h2 className="text-xl font-bold tracking-tight text-primary">Order Summary</h2>

      <dl className="space-y-3.5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <dt>Items ({numOfCartItems})</dt>
          <dd className="font-medium text-foreground">
            {totalCartPrice.toLocaleString()} {currency}
          </dd>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <dt>Estimated Delivery</dt>
          <dd className="font-medium text-emerald-600">Calculated at checkout</dd>
        </div>

        <div className="border-t border-border pt-3.5 flex items-center justify-between">
          <dt className="text-base font-semibold text-foreground">Total</dt>
          <dd className="text-xl font-bold text-primary">
            {totalCartPrice.toLocaleString()} {currency}
          </dd>
        </div>
      </dl>

      <div className="space-y-3 pt-2">
        <Link
          href="/checkout"
          className="flex w-full min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <Button
          type="button"
          variant="outline"
          onClick={handleClearCart}
          disabled={isClearing || isMutating || numOfCartItems === 0}
          className="w-full rounded-full border-border text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          {isClearing ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Clearing Cart...</span>
            </>
          ) : (
            <>
              <Trash2 className="size-4" aria-hidden="true" />
              <span>Clear Cart</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
