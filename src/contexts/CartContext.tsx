"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import type { CartData, CartResponse } from "@/types/cart";
import {
  getUserCart,
  addProductToCart,
  updateProductCount,
  removeProductFromCart,
  clearCart as apiClearCart,
} from "@/services/cartService";

export interface CartContextValue {
  cart: CartData | null;
  numOfCartItems: number;
  totalCartPrice: number;
  cartId: string | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  getCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, count: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  clearError: () => void;
}

interface CartState {
  userKey: string | null;
  cart: CartData | null;
  cartId: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const token = session?.token;

  const currentUserKey = status === "authenticated" && userEmail ? userEmail : null;

  const [state, setState] = useState<CartState>({
    userKey: null,
    cart: null,
    cartId: null,
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (state.userKey !== currentUserKey) {
    setState({
      userKey: currentUserKey,
      cart: null,
      cartId: null,
    });
  }

  const isCurrentSession = state.userKey === currentUserKey && currentUserKey !== null;
  const cart = isCurrentSession ? state.cart : null;
  const cartId = isCurrentSession ? state.cartId : null;

  const numOfCartItems = useMemo(() => {
    return cart?.products?.length ?? 0;
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart?.totalCartPrice ?? 0;
  }, [cart]);

  const isInitialLoading =
    status === "loading" ||
    (status === "authenticated" && currentUserKey !== null && cart === null && error === null);
  const isLoading = isInitialLoading || isRefreshing;

  useEffect(() => {
    if (status !== "authenticated" || !currentUserKey || !token) {
      return;
    }

    let isMounted = true;

    getUserCart(token)
      .then((response) => {
        if (!isMounted) return;
        setState({
          userKey: currentUserKey,
          cart: response.data ?? null,
          cartId: response.cartId ?? response.data?._id ?? null,
        });
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load cart.";
        setError(message);
      });

    return () => {
      isMounted = false;
    };
  }, [status, currentUserKey, token]);

  const refreshCart = useCallback(async (): Promise<void> => {
    if (!token || !currentUserKey) return;

    setIsRefreshing(true);
    try {
      const response = await getUserCart(token);
      setState({
        userKey: currentUserKey,
        cart: response.data ?? null,
        cartId: response.cartId ?? response.data?._id ?? null,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh cart.";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  }, [token, currentUserKey]);

  const runMutation = useCallback(
    async (
      mutationFn: (activeToken: string) => Promise<CartResponse>,
      defaultErrorMsg: string
    ): Promise<boolean> => {
      if (!token || !currentUserKey) {
        setError("You must be logged in to modify your cart.");
        return false;
      }

      if (isMutating) {
        return false;
      }

      setIsMutating(true);
      setError(null);

      try {
        const response = await mutationFn(token);
        setState({
          userKey: currentUserKey,
          cart: response.data ?? null,
          cartId: response.cartId ?? response.data?._id ?? null,
        });
        setError(null);
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : defaultErrorMsg;
        setError(message);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [token, currentUserKey, isMutating]
  );

  const addToCart = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!productId || !productId.trim()) {
        setError("Invalid product ID.");
        return false;
      }
      return runMutation(
        (tok) => addProductToCart(productId.trim(), tok),
        "Failed to add product to cart."
      );
    },
    [runMutation]
  );

  const updateQuantity = useCallback(
    async (productId: string, count: number): Promise<boolean> => {
      if (!productId || !productId.trim()) {
        setError("Invalid product ID.");
        return false;
      }
      if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
        setError("Quantity must be a valid non-negative number.");
        return false;
      }
      return runMutation(
        (tok) => updateProductCount(productId.trim(), count, tok),
        "Failed to update product quantity."
      );
    },
    [runMutation]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!productId || !productId.trim()) {
        setError("Invalid product ID.");
        return false;
      }
      return runMutation(
        (tok) => removeProductFromCart(productId.trim(), tok),
        "Failed to remove item from cart."
      );
    },
    [runMutation]
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    return runMutation((tok) => apiClearCart(tok), "Failed to clear cart.");
  }, [runMutation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      numOfCartItems,
      totalCartPrice,
      cartId,
      isLoading,
      isMutating,
      error,
      refreshCart,
      getCart: refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      clearError,
    }),
    [
      cart,
      numOfCartItems,
      totalCartPrice,
      cartId,
      isLoading,
      isMutating,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      clearError,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
