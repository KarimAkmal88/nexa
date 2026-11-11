import type {
  CashOrderResponse,
  CheckoutSessionResponse,
  OrderData,
  OrderErrorPayload,
  ShippingAddress,
  VerifyTokenResponse,
} from "@/types/order";

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

async function handleOrderResponse<T>(response: Response): Promise<T> {
  const responseData = (await response.json().catch(() => null)) as
    | T
    | OrderErrorPayload
    | null;

  if (!response.ok) {
    const errorPayload = responseData as OrderErrorPayload | null;
    throw new Error(
      errorPayload?.message || `Order API request failed with status ${response.status}`
    );
  }

  return responseData as T;
}

export function isValidCheckoutUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url.trim());
    const isHttps = parsed.protocol === "https:";
    const isStripeHost =
      parsed.hostname === "checkout.stripe.com" ||
      parsed.hostname.endsWith(".stripe.com");

    return isHttps && isStripeHost;
  } catch {
    return false;
  }
}

export async function createCashOrder(
  cartId: string,
  token: string,
  shippingAddress: ShippingAddress
): Promise<CashOrderResponse> {
  if (!cartId || !cartId.trim()) {
    throw new Error("Cart ID is required to create a cash order.");
  }

  if (!shippingAddress || !shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
    throw new Error("Valid shipping address details, phone, and city are required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/orders/${encodeURIComponent(cartId.trim())}`,
    {
      method: "POST",
      headers: getAuthHeaders(token, true),
      body: JSON.stringify({ shippingAddress }),
      cache: "no-store",
    }
  );

  return handleOrderResponse<CashOrderResponse>(response);
}

export async function createOnlineCheckoutSession(
  cartId: string,
  token: string,
  shippingAddress: ShippingAddress,
  returnUrl?: string
): Promise<CheckoutSessionResponse> {
  if (!cartId || !cartId.trim()) {
    throw new Error("Cart ID is required to initiate online checkout.");
  }

  if (!shippingAddress || !shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
    throw new Error("Valid shipping address details, phone, and city are required.");
  }

  const origin =
    returnUrl ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:3000");

  const url = new URL(
    `${API_BASE_URL}/api/v1/orders/checkout-session/${encodeURIComponent(cartId.trim())}`
  );
  url.searchParams.set("url", origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: getAuthHeaders(token, true),
    body: JSON.stringify({ shippingAddress }),
    cache: "no-store",
  });

  return handleOrderResponse<CheckoutSessionResponse>(response);
}

export async function getUserOrders(token: string): Promise<OrderData[]> {
  const headers = getAuthHeaders(token);

  const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/auth/verifyToken`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const verifyData = await handleOrderResponse<VerifyTokenResponse>(verifyResponse);
  const userId = verifyData?.decoded?.id?.trim();

  if (!userId) {
    throw new Error("Unable to verify user identity.");
  }

  const ordersResponse = await fetch(
    `${API_BASE_URL}/api/v1/orders/user/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  const ordersData = await handleOrderResponse<OrderData[] | { data?: OrderData[] }>(
    ordersResponse
  );

  if (Array.isArray(ordersData)) {
    return ordersData;
  }

  if (Array.isArray(ordersData?.data)) {
    return ordersData.data;
  }

  return [];
}
