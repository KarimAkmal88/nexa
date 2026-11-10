import type {
  WishlistErrorPayload,
  WishlistMutationResponse,
  WishlistResponse,
} from "@/types/wishlist";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

export class WishlistApiError extends Error {
  public readonly status: number;
  public readonly statusMsg?: string | number;
  public readonly isAuthError: boolean;
  public readonly isNotFoundError: boolean;

  constructor(
    status: number,
    message: string,
    statusMsg?: string | number
  ) {
    super(message);
    this.name = "WishlistApiError";
    this.status = status;
    this.statusMsg = statusMsg;
    this.isAuthError = status === 401;
    this.isNotFoundError = status === 404;
    Object.setPrototypeOf(this, WishlistApiError.prototype);
  }
}

function getAuthHeaders(token: string, contentType: boolean = false): HeadersInit {
  if (!token || !token.trim()) {
    throw new WishlistApiError(
      401,
      "Authentication required. A valid session token must be provided."
    );
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
  let responseData: unknown = null;
  try {
    responseData = await response.json();
  } catch {
    // Response body is not valid JSON
  }

  if (!response.ok) {
    const errorPayload = responseData as WishlistErrorPayload | null;
    const message =
      errorPayload?.message ||
      `Wishlist API request failed with status ${response.status}`;
    const statusMsg = errorPayload?.statusMsg;

    throw new WishlistApiError(response.status, message, statusMsg);
  }

  return responseData as T;
}

/**
 * Retrieve the current logged-in user's wishlist via Route API v1.
 * GET /api/v1/wishlist
 */
export async function getUserWishlist(token: string): Promise<WishlistResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    return await handleWishlistResponse<WishlistResponse>(response);
  } catch (error) {
    if (error instanceof WishlistApiError) throw error;
    throw new WishlistApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the wishlist server."
    );
  }
}

/**
 * Add a product to the user's wishlist via Route API v1.
 * POST /api/v1/wishlist
 */
export async function addProductToWishlist(
  productId: string,
  token: string
): Promise<WishlistMutationResponse> {
  if (!productId || !productId.trim()) {
    throw new WishlistApiError(
      400,
      "A valid product ID is required to add an item to the wishlist."
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
      method: "POST",
      headers: getAuthHeaders(token, true),
      body: JSON.stringify({ productId: productId.trim() }),
    });

    return await handleWishlistResponse<WishlistMutationResponse>(response);
  } catch (error) {
    if (error instanceof WishlistApiError) throw error;
    throw new WishlistApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the wishlist server."
    );
  }
}

/**
 * Remove a product from the user's wishlist via Route API v1.
 * DELETE /api/v1/wishlist/:productId
 */
export async function removeProductFromWishlist(
  productId: string,
  token: string
): Promise<WishlistMutationResponse> {
  if (!productId || !productId.trim()) {
    throw new WishlistApiError(
      400,
      "A valid product ID is required to remove an item from the wishlist."
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/wishlist/${encodeURIComponent(productId.trim())}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(token),
      }
    );

    return await handleWishlistResponse<WishlistMutationResponse>(response);
  } catch (error) {
    if (error instanceof WishlistApiError) throw error;
    throw new WishlistApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the wishlist server."
    );
  }
}
