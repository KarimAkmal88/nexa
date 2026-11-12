"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/contexts/CartContext";

interface CartItemRowProps {
  item: CartItem;
  currency?: string;
  onPendingChange?: (productId: string, isPending: boolean) => void;
}

export default function CartItemRow({
  item,
  currency = "EGP",
  onPendingChange,
}: CartItemRowProps) {
  const { updateQuantity, removeItem, isMutating } = useCart();

  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetCountRef = useRef<number>(item.count);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  const displayCount = pendingCount ?? item.count;
  const isPendingUpdate = pendingCount !== null || isUpdating;

  useEffect(() => {
    onPendingChange?.(item.product._id, isPendingUpdate);
    return () => {
      onPendingChange?.(item.product._id, false);
    };
  }, [item.product._id, isPendingUpdate, onPendingChange]);

  const dispatchUpdate = () => {
    onPendingChange?.(item.product._id, true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const target = targetCountRef.current;
      if (target === item.count) {
        setPendingCount(null);
        return;
      }

      setIsUpdating(true);
      const success = await updateQuantity(item.product._id, target);

      if (!success) {
        targetCountRef.current = item.count;
      }

      setIsUpdating(false);
      setPendingCount(null);
    }, 400);
  };

  const handleIncrement = () => {
    if (isRemoving || isMutating || isUpdating) return;
    const nextCount = displayCount + 1;
    targetCountRef.current = nextCount;
    setPendingCount(nextCount);
    dispatchUpdate();
  };

  const handleDecrement = () => {
    if (isRemoving || isMutating || isUpdating || displayCount <= 1) return;
    const nextCount = Math.max(1, displayCount - 1);
    targetCountRef.current = nextCount;
    setPendingCount(nextCount);
    dispatchUpdate();
  };

  const handleRemove = async () => {
    if (isRemoving || isMutating) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setPendingCount(null);
    targetCountRef.current = item.count;
    setIsRemoving(true);
    await removeItem(item.product._id);
    setIsRemoving(false);
  };

  const itemSubtotal = item.price * displayCount;

  return (
    <li className="flex flex-col sm:flex-row gap-4 py-5 sm:py-6 border-b border-border last:border-b-0">
      <Link
        href={`/products/${encodeURIComponent(item.product._id)}`}
        className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl bg-muted border border-border self-center sm:self-start"
      >
        <Image
          src={item.product.imageCover}
          alt={item.product.title}
          fill
          sizes="112px"
          className="object-contain p-2"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${encodeURIComponent(item.product._id)}`}
              className="line-clamp-2 text-base font-semibold text-primary hover:underline"
            >
              {item.product.title}
            </Link>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {item.product.brand?.name && (
                <span>
                  Brand: <strong className="text-foreground font-medium">{item.product.brand.name}</strong>
                </span>
              )}
              {item.product.category?.name && (
                <span>
                  Category: <strong className="text-foreground font-medium">{item.product.category.name}</strong>
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving || isMutating || isUpdating}
            aria-label={`Remove ${item.product.title} from cart`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {isRemoving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
          <div>
            <p className="text-base sm:text-lg font-bold text-primary">
              {itemSubtotal.toLocaleString()} {currency}
            </p>
            {displayCount > 1 && (
              <p className="text-xs text-muted-foreground">
                {item.price.toLocaleString()} {currency} each
              </p>
            )}
          </div>

          <div
            role="group"
            aria-label={`Quantity for ${item.product.title}`}
            className="flex items-center rounded-full border border-border bg-background px-1 py-0.5 shadow-2xs"
          >
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isRemoving || isMutating || isUpdating || displayCount <= 1}
              aria-label={`Decrease quantity of ${item.product.title}`}
              className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              className="flex min-w-8 items-center justify-center text-sm font-semibold tabular-nums text-foreground"
            >
              {isUpdating ? (
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : (
                displayCount
              )}
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              disabled={isRemoving || isMutating || isUpdating}
              aria-label={`Increase quantity of ${item.product.title}`}
              className="flex size-8 items-center justify-center rounded-full text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
