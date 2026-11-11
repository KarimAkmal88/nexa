import type { CartErrorPayload, CartResponse } from "@/types/cart";

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

async function handleCartResponse(response: Response): Promise<CartResponse> {
  const responseData = (await response.json().catch(() => null)) as
    | CartResponse
    | CartErrorPayload
    | null;

  if (!response.ok) {
    const errorPayload = responseData as CartErrorPayload | null;
    throw new Error(
      errorPayload?.message || `Cart API request failed with status ${response.status}`
    );
  }

  return responseData as CartResponse;
}

export async function getUserCart(token: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });

  return handleCartResponse(response);
}

export async function addProductToCart(
  productId: string,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new Error("A valid product ID is required to add an item to the cart.");
  }

  const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
    method: "POST",
    headers: getAuthHeaders(token, true),
    body: JSON.stringify({ productId: productId.trim() }),
    cache: "no-store",
  });

  return handleCartResponse(response);
}

export async function updateProductCount(
  productId: string,
  count: number,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new Error("A valid product ID is required to update quantity.");
  }

  if (
    typeof count !== "number" ||
    !Number.isFinite(count) ||
    !Number.isInteger(count) ||
    count < 0
  ) {
    throw new Error("Quantity must be a finite, non-negative integer.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v2/cart/${encodeURIComponent(productId.trim())}`,
    {
      method: "PUT",
      headers: getAuthHeaders(token, true),
      body: JSON.stringify({ count }),
      cache: "no-store",
    }
  );

  return handleCartResponse(response);
}

export async function removeProductFromCart(
  productId: string,
  token: string
): Promise<CartResponse> {
  if (!productId || !productId.trim()) {
    throw new Error("A valid product ID is required to remove an item.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v2/cart/${encodeURIComponent(productId.trim())}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
      cache: "no-store",
    }
  );

  return handleCartResponse(response);
}

export async function clearCart(token: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/cart`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });

  return handleCartResponse(response);
}
