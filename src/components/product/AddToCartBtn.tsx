"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartBtnProps {
  productId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export default function AddToCartBtn({
  productId,
  className,
  variant = "default",
  size = "default",
  fullWidth = true,
}: AddToCartBtnProps) {
  const { data: session, status } = useSession();
  const { addToCart, isMutating } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated" || !session?.token) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const returnUrl = search ? `${pathname}${search}` : (pathname || "/");
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;
      router.push(loginUrl);
      return;
    }

    if (isLoading || isMutating) return;

    setIsLoading(true);
    setErrorMessage(null);

    const success = await addToCart(productId);

    setIsLoading(false);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } else {
      setErrorMessage("Could not add to cart. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className={fullWidth ? "w-full" : undefined}>
      <Button
        type="button"
        variant={isSuccess ? "outline" : variant}
        size={size}
        onClick={handleAddToCart}
        disabled={isLoading || isMutating}
        className={cn(fullWidth && "w-full", className)}
        aria-label={isSuccess ? "Product added to cart" : "Add to cart"}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>Adding...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="size-4 text-emerald-600" aria-hidden="true" />
            <span className="text-emerald-700 font-semibold">Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span>Add to Cart</span>
          </>
        )}
      </Button>
      {errorMessage && (
        <p role="alert" className="mt-1.5 text-xs text-red-600 font-medium text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
