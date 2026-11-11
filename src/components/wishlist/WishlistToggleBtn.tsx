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
          "group inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "default" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          isSaved
            ? "border-accent/40 bg-accent/10 text-foreground hover:bg-accent/15"
            : "border-border bg-background text-foreground hover:bg-secondary hover:border-primary/30",
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
              isSaved ? "fill-accent text-accent" : "text-muted-foreground group-hover:text-accent"
            )}
            aria-hidden="true"
          />
        )}
        <span>{isSaved ? "Saved to Wishlist" : "Add to Wishlist"}</span>
      </button>
    );
  }

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
        "flex items-center justify-center rounded-full border border-border/80 bg-white/90 backdrop-blur-xs shadow-xs transition-all hover:bg-white hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2",
        containerSizes[size],
        isSaved
          ? "border-accent/40 text-accent"
          : "text-muted-foreground hover:text-accent",
        isMutating && "cursor-not-allowed opacity-75",
        className
      )}
    >
      {isMutating ? (
        <Loader2 className={cn(iconSizes[size], "animate-spin text-muted-foreground")} aria-hidden="true" />
      ) : (
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors",
            isSaved ? "fill-accent text-accent" : "hover:text-accent"
          )}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
