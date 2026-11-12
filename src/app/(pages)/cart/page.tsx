"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AlertCircle, ArrowLeft, ArrowRight, ChevronRight, Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { status } = useSession();
  const { cart, numOfCartItems, isLoading, error, clearError, refreshCart } = useCart();
  const [pendingItemIds, setPendingItemIds] = useState<Set<string>>(() => new Set());

  const handlePendingChange = useCallback((productId: string, isPending: boolean) => {
    setPendingItemIds((prev) => {
      const hasId = prev.has(productId);
      if (hasId === isPending) return prev;
      const next = new Set(prev);
      if (isPending) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  }, []);

  if (status === "unauthenticated") {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-8 rounded-3xl border border-border bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
            <ShoppingBag className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Sign in to view your cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your shopping cart is tied to your account. Log in to view your saved items and complete checkout.
          </p>
          <Link
            href="/login?callbackUrl=/cart"
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  if (status === "loading" || isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 flex flex-col items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">Loading your cart...</p>
      </main>
    );
  }

  if (!cart && error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-8 rounded-3xl border border-red-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Failed to load cart</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => refreshCart()}
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </main>
    );
  }

  const products = cart?.products ?? [];

  if (cart && products.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span aria-current="page" className="font-medium text-foreground">
            Cart
          </span>
        </nav>

        <div className="flex flex-col items-center max-w-md mx-auto text-center py-16 px-6 rounded-3xl border border-border bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
            <ShoppingBag className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our collection and discover products you love.
          </p>
          <Link
            href="/products"
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Explore Products</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span aria-current="page" className="font-medium text-foreground">
          Cart
        </span>
      </nav>

      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Shopping Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {numOfCartItems} {numOfCartItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-xs font-semibold underline hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:gap-12 items-start">
        <section
          aria-label="Cart products list"
          className="rounded-2xl border border-border bg-card p-6 shadow-xs"
        >
          <ul className="divide-y divide-border">
            {products.map((item) => (
              <CartItemRow
                key={item._id}
                item={item}
                onPendingChange={handlePendingChange}
              />
            ))}
          </ul>
        </section>

        <CartSummary hasPendingUpdates={pendingItemIds.size > 0} />
      </div>
    </main>
  );
}
