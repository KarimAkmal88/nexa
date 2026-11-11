import type {
  WishlistErrorPayload,
  WishlistMutationResponse,
  WishlistResponse,
} from "@/types/wishlist";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

function getAuthHeaders(token: string, contentType = false): HeadersInit {
  if (!token || !token.trim()) {
    throw new Error("Authentication required. A valid session token must be provided.");
  }

  const headers: Record<string, string> = {
    token: token.trim(),
  };

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function handleWishlistResponse<T>(response: Response): Promise<T> {
  const responseData = (await response.json().catch(() => null)) as
    | T
    | WishlistErrorPayload
    | null;

  if (!response.ok) {
    const errorPayload = responseData as WishlistErrorPayload | null;
    throw new Error(
      errorPayload?.message || `Wishlist API request failed with status ${response.status}`
    );
  }

  return responseData as T;
}

export async function getUserWishlist(token: string): Promise<WishlistResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });

  return handleWishlistResponse<WishlistResponse>(response);
}

export async function addProductToWishlist(
  productId: string,
  token: string
): Promise<WishlistMutationResponse> {
  if (!productId || !productId.trim()) {
    throw new Error("A valid product ID is required to add an item to the wishlist.");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
    method: "POST",
    headers: getAuthHeaders(token, true),
    body: JSON.stringify({ productId: productId.trim() }),
  });

  return handleWishlistResponse<WishlistMutationResponse>(response);
}

export async function removeProductFromWishlist(
  productId: string,
  token: string
): Promise<WishlistMutationResponse> {
  if (!productId || !productId.trim()) {
    throw new Error("A valid product ID is required to remove an item from the wishlist.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/wishlist/${encodeURIComponent(productId.trim())}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  return handleWishlistResponse<WishlistMutationResponse>(response);
}
