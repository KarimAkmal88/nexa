import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { OrderData } from "@/types/order";

interface OrderCardProps {
  order: OrderData;
}

function formatOrderDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export default function OrderCard({ order }: OrderCardProps) {
  const orderRef = order.id ?? order._id;
  const formattedDate = formatOrderDate(order.createdAt);
  const isCardPayment = order.paymentMethodType === "card";
  const isCashPayment = order.paymentMethodType === "cash";
  const isPaid = Boolean(order.isPaid);
  const isDelivered = Boolean(order.isDelivered);
  const cartItems = order.cartItems ?? [];
  const address = order.shippingAddress;

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-primary">
              Order #{String(orderRef)}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground">
              {isCardPayment ? (
                <CreditCard className="size-3.5 text-primary" aria-hidden="true" />
              ) : (
                <Banknote className="size-3.5 text-primary" aria-hidden="true" />
              )}
              <span>
                {isCardPayment
                  ? "Card / Online"
                  : isCashPayment
                  ? "Cash on Delivery"
                  : order.paymentMethodType || "Order"}
              </span>
            </span>
          </div>
          {formattedDate && (
            <p className="text-xs text-muted-foreground">Placed on {formattedDate}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isPaid
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
            ) : (
              <Clock className="size-3.5" aria-hidden="true" />
            )}
            <span>{isPaid ? "Paid" : "Unpaid"}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              isDelivered
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-border bg-muted text-foreground"
            }`}
          >
            <Truck className="size-3.5" aria-hidden="true" />
            <span>{isDelivered ? "Delivered" : "Processing"}</span>
          </span>
        </div>
      </div>

      {cartItems.length > 0 && (
        <ul className="divide-y divide-border py-2">
          {cartItems.map((item) => {
            const product = item.product;
            const productId = product?._id || product?.id;
            const itemTitle = product?.title || "Product";
            const quantity = item.count ?? 0;
            const unitPrice = item.price ?? 0;

            return (
              <li key={item._id} className="flex items-center gap-4 py-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  {product?.imageCover ? (
                    <Image
                      src={product.imageCover}
                      alt={itemTitle}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="size-5" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {productId ? (
                    <Link
                      href={`/products/${productId}`}
                      className="text-sm font-semibold text-foreground hover:text-primary hover:underline line-clamp-1"
                    >
                      {itemTitle}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-foreground line-clamp-1">
                      {itemTitle}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Qty: {quantity} × {unitPrice.toLocaleString()} EGP
                  </p>
                </div>

                <div className="shrink-0 text-sm font-semibold text-primary">
                  {(quantity * unitPrice).toLocaleString()} EGP
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-2 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-end sm:justify-between">
        {address ? (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-wider text-foreground">
              Shipping Details
            </p>
            <p className="flex items-center gap-1.5 text-foreground">
              <MapPin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>
                {address.details}
                {address.city ? `, ${address.city}` : ""}
              </span>
            </p>
            {address.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>{address.phone}</span>
              </p>
            )}
          </div>
        ) : (
          <div />
        )}

        <div className="text-left sm:text-right">
          {((order.shippingPrice ?? 0) > 0 || (order.taxPrice ?? 0) > 0) && (
            <p className="mb-1 text-xs text-muted-foreground">
              {(order.shippingPrice ?? 0) > 0 &&
                `Shipping: ${(order.shippingPrice ?? 0).toLocaleString()} EGP`}
              {(order.shippingPrice ?? 0) > 0 && (order.taxPrice ?? 0) > 0 && " • "}
              {(order.taxPrice ?? 0) > 0 &&
                `Tax: ${(order.taxPrice ?? 0).toLocaleString()} EGP`}
            </p>
          )}
          <p className="text-xs font-medium text-muted-foreground">Order Total</p>
          <p className="text-lg font-bold text-primary">
            {(order.totalOrderPrice ?? 0).toLocaleString()} EGP
          </p>
        </div>
      </div>
    </article>
  );
}
