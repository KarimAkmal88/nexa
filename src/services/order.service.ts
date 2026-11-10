import type {
  CashOrderResponse,
  CheckoutSessionResponse,
  OrderErrorPayload,
  ShippingAddress,
} from "@/types/order";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://ecommerce.routemisr.com";

export class OrderApiError extends Error {
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
    this.name = "OrderApiError";
    this.status = status;
    this.statusMsg = statusMsg;
    this.isAuthError = status === 401;
    this.isNotFoundError = status === 404;
    Object.setPrototypeOf(this, OrderApiError.prototype);
  }
}

function getAuthHeaders(token: string, contentType: boolean = false): HeadersInit {
  if (!token || !token.trim()) {
    throw new OrderApiError(
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

async function handleOrderResponse<T>(response: Response): Promise<T> {
  let responseData: unknown = null;
  try {
    responseData = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const errorPayload = responseData as OrderErrorPayload | null;
    const message =
      errorPayload?.message ||
      `Order API request failed with status ${response.status}`;
    const statusMsg = errorPayload?.statusMsg;

    throw new OrderApiError(response.status, message, statusMsg);
  }

  return responseData as T;
}

/**
 * Validates whether an external checkout session redirect URL is safe to follow.
 * Verifies that the string parses as an HTTPS URL and belongs to an authorized Stripe domain.
 */
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

/**
 * Create a Cash On Delivery order for the specified cart.
 * Endpoint: POST /api/v1/orders/:cartId
 */
export async function createCashOrder(
  cartId: string,
  token: string,
  shippingAddress: ShippingAddress
): Promise<CashOrderResponse> {
  if (!cartId || !cartId.trim()) {
    throw new OrderApiError(400, "Cart ID is required to create a cash order.");
  }

  if (!shippingAddress || !shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
    throw new OrderApiError(400, "Valid shipping address details, phone, and city are required.");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/${encodeURIComponent(cartId.trim())}`,
      {
        method: "POST",
        headers: getAuthHeaders(token, true),
        body: JSON.stringify({ shippingAddress }),
        cache: "no-store",
      }
    );

    return await handleOrderResponse<CashOrderResponse>(response);
  } catch (error) {
    if (error instanceof OrderApiError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "Failed to create cash order.";
    throw new OrderApiError(500, message);
  }
}

/**
 * Initiate an Online Checkout session (Stripe) for the specified cart.
 * Endpoint: POST /api/v1/orders/checkout-session/:cartId?url=<frontend_origin>
 */
export async function createOnlineCheckoutSession(
  cartId: string,
  token: string,
  shippingAddress: ShippingAddress,
  returnUrl?: string
): Promise<CheckoutSessionResponse> {
  if (!cartId || !cartId.trim()) {
    throw new OrderApiError(400, "Cart ID is required to initiate online checkout.");
  }

  if (!shippingAddress || !shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
    throw new OrderApiError(400, "Valid shipping address details, phone, and city are required.");
  }

  const origin =
    returnUrl ||
    (typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "http://localhost:3000");

  try {
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

    return await handleOrderResponse<CheckoutSessionResponse>(response);
  } catch (error) {
    if (error instanceof OrderApiError) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "Failed to initiate online checkout session.";
    throw new OrderApiError(500, message);
  }
}
