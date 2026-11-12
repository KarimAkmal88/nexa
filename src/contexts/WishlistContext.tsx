"use client";

import type { ProductI } from "@/interfaces/product";
import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
} from "@/services/wishlistService";
import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface WishlistContextValue {
  wishlistIds: string[];
  wishlistProducts: ProductI[] | null;
  wishlistCount: number;
  isLoading: boolean;
  isMutatingId: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  clearError: () => void;
}

interface WishlistState {
  userKey: string | null;
  wishlistIds: string[];
  wishlistProducts: ProductI[] | null;
}

const EMPTY_WISHLIST_IDS: string[] = [];

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const token = session?.token;

  const currentUserKey =
    status === "authenticated" && userEmail ? userEmail : null;

  const [state, setState] = useState<WishlistState>({
    userKey: null,
    wishlistIds: [],
    wishlistProducts: null,
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [mutatingIds, setMutatingIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (state.userKey !== currentUserKey) {
    setState({
      userKey: currentUserKey,
      wishlistIds: [],
      wishlistProducts: null,
    });
  }

  const isCurrentSession =
    state.userKey === currentUserKey && currentUserKey !== null;
  const wishlistIds = useMemo(() => {
    return isCurrentSession ? state.wishlistIds : EMPTY_WISHLIST_IDS;
  }, [isCurrentSession, state.wishlistIds]);
  const wishlistProducts = isCurrentSession ? state.wishlistProducts : null;
  const wishlistCount = wishlistIds.length;

  const isInitialLoading =
    status === "loading" ||
    (status === "authenticated" &&
      currentUserKey !== null &&
      state.wishlistProducts === null &&
      error === null);
  const isLoading = isInitialLoading || isRefreshing;

  useEffect(() => {
    if (status !== "authenticated" || !currentUserKey || !token) {
      return;
    }

    let isMounted = true;

    getUserWishlist(token)
      .then((response) => {
        if (!isMounted) return;
        const products = response.data ?? [];
        const ids = products.map((item) => item._id);
        setState({
          userKey: currentUserKey,
          wishlistIds: ids,
          wishlistProducts: products,
        });
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load wishlist.";
        setError(message);
      });

    return () => {
      isMounted = false;
    };
  }, [status, currentUserKey, token]);

  const refreshWishlist = useCallback(async (): Promise<void> => {
    if (!token || !currentUserKey) return;

    setIsRefreshing(true);
    try {
      const response = await getUserWishlist(token);
      const products = response.data ?? [];
      const ids = products.map((item) => item._id);
      setState({
        userKey: currentUserKey,
        wishlistIds: ids,
        wishlistProducts: products,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh wishlist.";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  }, [token, currentUserKey]);

  const isInWishlist = useCallback(
    (productId: string): boolean => {
      if (!productId) return false;
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const isMutatingId = useCallback(
    (productId: string): boolean => {
      if (!productId) return false;
      return mutatingIds.includes(productId);
    },
    [mutatingIds]
  );

  const addToWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!productId || !productId.trim()) {
        setError("Invalid product ID.");
        return false;
      }

      if (!token || !currentUserKey) {
        setError("You must be logged in to modify your wishlist.");
        return false;
      }

      const cleanId = productId.trim();
      if (mutatingIds.includes(cleanId)) {
        return false;
      }

      setMutatingIds((prev) => [...prev, cleanId]);
      setError(null);

      try {
        const response = await addProductToWishlist(cleanId, token);
        const updatedIds = response.data ?? [];
        setState((prev) => ({
          ...prev,
          wishlistIds: updatedIds,
        }));

        if (state.wishlistProducts !== null) {
          getUserWishlist(token)
            .then((res) => {
              setState((prev) => ({
                ...prev,
                wishlistProducts: res.data ?? [],
                wishlistIds: (res.data ?? []).map((p) => p._id),
              }));
            })
            .catch(() => {
            });
        }

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to add product to wishlist.";
        setError(message);
        return false;
      } finally {
        setMutatingIds((prev) => prev.filter((id) => id !== cleanId));
      }
    },
    [token, currentUserKey, mutatingIds, state.wishlistProducts]
  );

  const removeFromWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!productId || !productId.trim()) {
        setError("Invalid product ID.");
        return false;
      }

      if (!token || !currentUserKey) {
        setError("You must be logged in to modify your wishlist.");
        return false;
      }

      const cleanId = productId.trim();
      if (mutatingIds.includes(cleanId)) {
        return false;
      }

      setMutatingIds((prev) => [...prev, cleanId]);
      setError(null);

      try {
        const response = await removeProductFromWishlist(cleanId, token);
        const remainingIds = response.data ?? [];
        setState((prev) => ({
          ...prev,
          wishlistIds: remainingIds,
          wishlistProducts: prev.wishlistProducts
            ? prev.wishlistProducts.filter((p) => p._id !== cleanId)
            : null,
        }));
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to remove product from wishlist.";
        setError(message);
        return false;
      } finally {
        setMutatingIds((prev) => prev.filter((id) => id !== cleanId));
      }
    },
    [token, currentUserKey, mutatingIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<boolean> => {
      if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
      } else {
        return addToWishlist(productId);
      }
    },
    [isInWishlist, removeFromWishlist, addToWishlist]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      wishlistProducts,
      wishlistCount,
      isLoading,
      isMutatingId,
      isInWishlist,
      error,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearError,
    }),
    [
      wishlistIds,
      wishlistProducts,
      wishlistCount,
      isLoading,
      isMutatingId,
      isInWishlist,
      error,
      refreshWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearError,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
