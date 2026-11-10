"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Heart,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import WishlistItemCard from "@/components/wishlist/WishlistItemCard";

export default function WishlistPage() {
  const { status } = useSession();
  const {
    wishlistProducts,
    wishlistCount,
    isLoading,
    error,
    clearError,
    refreshWishlist,
  } = useWishlist();

  // 1. Unauthenticated View
  if (status === "unauthenticated") {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-8 rounded-3xl border border-neutral-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Sign in to view your wishlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Save items you love and access your wishlist anytime from any device.
          </p>
          <Link
            href="/login?callbackUrl=/wishlist"
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Sign In to Continue</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  // 2. Loading State
  if (status === "loading" || isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 flex flex-col items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  // 3. Error State (Initial load failed)
  if (!wishlistProducts && error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center p-8 rounded-3xl border border-red-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Failed to load wishlist
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => refreshWishlist()}
            className="mt-6 flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </main>
    );
  }

  const products = wishlistProducts ?? [];

  // 4. Empty Wishlist View
  if (products.length === 0) {
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
            Wishlist
          </span>
        </nav>

        <div className="flex flex-col items-center max-w-md mx-auto text-center py-16 px-6 rounded-3xl border border-neutral-200 bg-card shadow-xs">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="size-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Your wishlist is empty
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our collection and save products you love to view them later.
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

  // 5. Populated Wishlist View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span aria-current="page" className="font-medium text-foreground">
          Wishlist
        </span>
      </nav>

      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlistCount} {wishlistCount === 1 ? "saved item" : "saved items"}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={clearError}
            aria-label="Dismiss error"
            className="text-red-500 hover:text-red-700"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <WishlistItemCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}
