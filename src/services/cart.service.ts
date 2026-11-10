import type { CartErrorPayload, CartResponse } from "@/types/cart";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

export class CartApiError extends Error {
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
    this.name = "CartApiError";
    this.status = status;
    this.statusMsg = statusMsg;
    this.isAuthError = status === 401;
    this.isNotFoundError = status === 404;
    Object.setPrototypeOf(this, CartApiError.prototype);
  }
}

function getAuthHeaders(token: string, contentType: boolean = false): HeadersInit {
  if (!token || !token.trim()) {
    throw new CartApiError(
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

async function handleCartResponse(response: Response): Promise<CartResponse> {
  let responseData: unknown = null;
  try {
    responseData = await response.json();
  } catch {
    // Response body is not valid JSON
  }

  if (!response.ok) {
    const errorPayload = responseData as CartErrorPayload | null;
    const message =
      errorPayload?.message ||
      `Cart API request failed with status ${response.status}`;
    const statusMsg = errorPayload?.statusMsg;

    throw new CartApiError(response.status, message, statusMsg);
  }

  return responseData as CartResponse;
}

/**
 * Retrieve the current logged-in user's cart via Route API v2.
 * GET /api/v2/cart
 */
export async function getUserCart(token: string): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    return await handleCartResponse(response);
  } catch (error) {
    if (error instanceof CartApiError) throw error;
    throw new CartApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the cart server."
    );
  }
}

/**
 * Add a product to the user's cart via Route API v2.
 * POST /api/v2/cart
 */
export async function addProductToCart(
  productId: string,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new CartApiError(400, "A valid product ID is required to add an item to the cart.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
      method: "POST",
      headers: getAuthHeaders(token, true),
      body: JSON.stringify({ productId: productId.trim() }),
      cache: "no-store",
    });

    return await handleCartResponse(response);
  } catch (error) {
    if (error instanceof CartApiError) throw error;
    throw new CartApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the cart server."
    );
  }
}

/**
 * Update the quantity/count of a specific product in the cart via Route API v2.
 * PUT /api/v2/cart/:productId
 *
 * Validates that count is a finite, non-negative integer (zero is valid in v2).
 */
export async function updateProductCount(
  productId: string,
  count: number,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new CartApiError(400, "A valid product ID is required to update quantity.");
  }

  if (
    typeof count !== "number" ||
    !Number.isFinite(count) ||
    !Number.isInteger(count) ||
    count < 0
  ) {
    throw new CartApiError(
      400,
      "Quantity must be a finite, non-negative integer."
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v2/cart/${encodeURIComponent(productId.trim())}`,
      {
        method: "PUT",
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({ count }),
        cache: "no-store",
      }
    );

    return await handleCartResponse(response);
  } catch (error) {
    if (error instanceof CartApiError) throw error;
    throw new CartApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the cart server."
    );
  }
}

/**
 * Alias for updateProductCount matching common naming conventions.
 */
export const updateProductQuantity = updateProductCount;

/**
 * Remove a specific product from the cart via Route API v2.
 * DELETE /api/v2/cart/:productId
 */
export async function removeProductFromCart(
  productId: string,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new CartApiError(400, "A valid product ID is required to remove an item.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v2/cart/${encodeURIComponent(productId.trim())}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(token),
        cache: "no-store",
      }
    );

    return await handleCartResponse(response);
  } catch (error) {
    if (error instanceof CartApiError) throw error;
    throw new CartApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the cart server."
    );
  }
}

/**
 * Clear the entire cart for the logged-in user via Route API v2.
 * DELETE /api/v2/cart
 */
export async function clearCart(token: string): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    return await handleCartResponse(response);
  } catch (error) {
    if (error instanceof CartApiError) throw error;
    throw new CartApiError(
      0,
      error instanceof Error ? error.message : "Unable to connect to the cart server."
    );
  }
}
