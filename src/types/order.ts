export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderItemProduct {
  _id: string;
  title?: string;
  imageCover?: string;
  ratingsAverage?: number;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  brand?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  id?: string;
}

export interface OrderCartItem {
  _id: string;
  count: number;
  price: number;
  product: OrderItemProduct;
}

export interface OrderData {
  _id: string;
  id?: number;
  totalOrderPrice?: number;
  paymentMethodType?: "cash" | "card" | string;
  isPaid?: boolean;
  isDelivered?: boolean;
  paidAt?: string;
  user?:
    | string
    | {
        _id?: string;
        name?: string;
        email?: string;
        phone?: string;
      };
  cartItems?: OrderCartItem[];
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  updatedAt?: string;
  taxPrice?: number;
  shippingPrice?: number;
  [key: string]: unknown;
}

export interface CashOrderResponse {
  status: string;
  data?: OrderData;
  message?: string;
}

export interface StripeSession {
  url?: string;
  success_url?: string;
  cancel_url?: string;
  client_reference_id?: string;
  customer_email?: string;
  [key: string]: unknown;
}

export interface CheckoutSessionResponse {
  status: string;
  session?: StripeSession;
  message?: string;
}

export interface OrderErrorPayload {
  statusMsg?: string;
  message?: string;
  errors?: Record<string, unknown> | Array<{ msg?: string; param?: string }>;
}

export interface VerifyTokenResponse {
  message?: string;
  decoded?: {
    id?: string;
    name?: string;
    role?: string;
    iat?: number;
    exp?: number;
  };
}
