"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Loader2,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import type { OrderData } from "@/types/order";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, numOfCartItems, cartId, isLoading } = useCart();
  const [placedOrder, setPlacedOrder] = useState<OrderData | null>(null);

  // 1. Unauthenticated View
  if (status === "unauthenticated") {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-8 rounded-3xl border border-neutral-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
            <ShoppingBag className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Sign in to complete checkout
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please log in with your Nexa account to securely enter your delivery address and complete payment.
          </p>
          <Link
            href="/login?callbackUrl=/checkout"
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  // 2. Loading State (Session or Cart loading)
  if (status === "loading" || (isLoading && !placedOrder)) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 flex flex-col items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Preparing checkout...
        </p>
      </main>
    );
  }

  // 3. Cash Order Success Confirmation View
  if (placedOrder) {
    const orderRef = placedOrder._id || placedOrder.id;
    const orderTotal = placedOrder.totalOrderPrice ?? 0;
    const address = placedOrder.shippingAddress;

    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1">
        <div className="flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl border border-emerald-200 bg-card shadow-xs">
          <div className="mb-5 flex size-18 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-10" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Thank you for shopping with Nexa. Your Cash on Delivery order has been registered and is being prepared for dispatch.
          </p>

          {/* Order Details Summary Card */}
          <div className="mt-8 w-full max-w-lg rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 text-left space-y-4 text-sm">
            {orderRef && (
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="font-mono text-xs font-semibold text-primary break-all">
                  {String(orderRef)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold text-foreground">
                Cash on Delivery
              </span>
            </div>

            {orderTotal > 0 && (
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-primary text-base">
                  {orderTotal.toLocaleString()} EGP
                </span>
              </div>
            )}

            {address && (
              <div className="space-y-1 pt-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  Shipping Address
                </span>
                <p className="text-foreground font-medium">{address.details}</p>
                <p className="text-muted-foreground text-xs">
                  {address.city} • Tel: {address.phone}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/products"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/cart"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>Back to Cart</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 4. Empty Cart View
  if (!cart || numOfCartItems === 0 || !cartId) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <Link href="/cart" className="hover:text-primary transition-colors">
            Cart
          </Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          <span aria-current="page" className="font-medium text-foreground">
            Checkout
          </span>
        </nav>

        <div className="flex flex-col items-center max-w-md mx-auto text-center py-16 px-6 rounded-3xl border border-neutral-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
            <PackageCheck className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            No items ready for checkout
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your shopping cart is currently empty. Add products to your cart before proceeding to checkout.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const token = session?.token || "";

  // 5. Active Checkout Form View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href="/cart" className="hover:text-primary transition-colors">
          Cart
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span aria-current="page" className="font-medium text-foreground">
          Checkout
        </span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your delivery details and choose your preferred payment option.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Shipping & Payment Method Form */}
        <div className="lg:col-span-7">
          <CheckoutForm
            cartId={cartId}
            token={token}
            onCashOrderSuccess={(order) => setPlacedOrder(order ?? null)}
          />
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
}
