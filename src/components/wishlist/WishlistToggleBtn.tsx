"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistToggleBtnProps {
  productId: string;
  productTitle?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "icon" | "button";
}

export default function WishlistToggleBtn({
  productId,
  productTitle,
  className,
  size = "default",
  variant = "icon",
}: WishlistToggleBtnProps) {
  const { data: session, status } = useSession();
  const { isInWishlist, isMutatingId, toggleWishlist } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const isSaved = isInWishlist(productId);
  const isMutating = isMutatingId(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If unauthenticated, redirect to login with current return URL
    if (status === "unauthenticated" || !session?.token) {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const returnUrl = search ? `${pathname}${search}` : pathname || "/";
      router.push(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (isMutating) return;

    await toggleWishlist(productId);
  };

  const accessibleLabel = isSaved
    ? productTitle
      ? `Remove ${productTitle} from wishlist`
      : "Remove from wishlist"
    : productTitle
    ? `Add ${productTitle} to wishlist`
    : "Add to wishlist";

  const iconSizes = {
    sm: "size-4",
    default: "size-5",
    lg: "size-6",
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isMutating}
        aria-label={accessibleLabel}
        aria-pressed={isSaved}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "default" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          isSaved
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-neutral-200 bg-background text-neutral-700 hover:bg-neutral-50 hover:text-rose-600",
          isMutating && "cursor-not-allowed opacity-75",
          className
        )}
      >
        {isMutating ? (
          <Loader2 className={cn(iconSizes[size], "animate-spin")} aria-hidden="true" />
        ) : (
          <Heart
            className={cn(
              iconSizes[size],
              "transition-colors",
              isSaved ? "fill-rose-500 text-rose-500" : "text-neutral-500"
            )}
            aria-hidden="true"
          />
        )}
        <span>{isSaved ? "Saved to Wishlist" : "Add to Wishlist"}</span>
      </button>
    );
  }

  // Default "icon" variant for product cards and compact headers
  const containerSizes = {
    sm: "size-7",
    default: "size-9",
    lg: "size-11",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isMutating}
      aria-label={accessibleLabel}
      aria-pressed={isSaved}
      className={cn(
        "flex items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 backdrop-blur-xs shadow-xs transition-all hover:bg-white hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2",
        containerSizes[size],
        isSaved
          ? "border-rose-200 text-rose-500"
          : "text-neutral-500 hover:text-rose-500",
        isMutating && "cursor-not-allowed opacity-75",
        className
      )}
    >
      {isMutating ? (
        <Loader2 className={cn(iconSizes[size], "animate-spin text-neutral-400")} aria-hidden="true" />
      ) : (
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors",
            isSaved ? "fill-rose-500 text-rose-500" : "hover:text-rose-500"
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
