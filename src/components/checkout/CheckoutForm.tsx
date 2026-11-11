"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Phone,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  shippingAddressSchema,
  type ShippingFormData,
} from "@/lib/validations/order";
import {
  createCashOrder,
  createOnlineCheckoutSession,
  isValidCheckoutUrl,
} from "@/services/orderService";
import type { OrderData } from "@/types/order";

interface CheckoutFormProps {
  cartId: string;
  token: string;
  onCashOrderSuccess: (order: OrderData | undefined) => void;
}

export default function CheckoutForm({
  cartId,
  token,
  onCashOrderSuccess,
}: CheckoutFormProps) {
  const { refreshCart } = useCart();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      details: "",
      phone: "",
      city: "",
      paymentMethod: "cash",
    },
  });

  const handleSelectPaymentMethod = (method: "cash" | "online") => {
    if (isSubmitting || isRedirecting) return;
    setPaymentMethod(method);
    setValue("paymentMethod", method, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: ShippingFormData) => {
    setServerError(null);

    const shippingAddress = {
      details: data.details.trim(),
      phone: data.phone.trim(),
      city: data.city.trim(),
    };

    if (paymentMethod === "cash") {
      try {
        const response = await createCashOrder(cartId, token, shippingAddress);

        if (response.status === "success") {
          await refreshCart();
          onCashOrderSuccess(response.data);
        } else {
          setServerError(
            response.message || "Failed to place cash order. Please try again."
          );
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while placing your order.";
        setServerError(message);
      }
    } else if (paymentMethod === "online") {
      try {
        setIsRedirecting(true);
        const origin =
          typeof window !== "undefined" ? window.location.origin : undefined;

        const response = await createOnlineCheckoutSession(
          cartId,
          token,
          shippingAddress,
          origin
        );

        const checkoutUrl = response.session?.url;

        if (response.status === "success" && checkoutUrl) {
          if (!isValidCheckoutUrl(checkoutUrl)) {
            setIsRedirecting(false);
            setServerError(
              "Security warning: Invalid checkout session URL returned by provider."
            );
            return;
          }

          window.location.assign(checkoutUrl);
        } else {
          setIsRedirecting(false);
          setServerError(
            response.message ||
              "Could not initiate online payment session. Please try again."
          );
        }
      } catch (err) {
        setIsRedirecting(false);
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while initiating online payment.";
        setServerError(message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-card p-6 sm:p-8 shadow-xs"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Shipping Information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your delivery address and contact information.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="size-5 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-medium">Order Submission Failed</p>
            <p className="mt-0.5 text-red-700">{serverError}</p>
          </div>
        </div>
      )}

      {isRedirecting && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
        >
          <Loader2 className="size-5 shrink-0 text-blue-600 animate-spin" aria-hidden="true" />
          <p className="font-medium">
            Redirecting to secure Stripe Checkout gateway...
          </p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Street Address & Details <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="details"
              type="text"
              placeholder="e.g. 123 Al-Tahrir St, Building 4, Apt 12"
              error={!!errors.details}
              disabled={isSubmitting || isRedirecting}
              className="pl-10"
              {...register("details")}
            />
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.details && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.details.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              City / Governorate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="city"
                type="text"
                placeholder="e.g. Cairo"
                error={!!errors.city}
                disabled={isSubmitting || isRedirecting}
                className="pl-10"
                {...register("city")}
              />
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.city && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="01012345678"
                error={!!errors.phone}
                disabled={isSubmitting || isRedirecting}
                className="pl-10"
                {...register("phone")}
              />
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-base font-bold text-primary mb-1">
          Payment Method
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose how you would like to pay for your order.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => handleSelectPaymentMethod("cash")}
            className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-neutral-200 hover:border-neutral-300 bg-card"
            } ${isSubmitting || isRedirecting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              id="paymentMethod-cash"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => handleSelectPaymentMethod("cash")}
              disabled={isSubmitting || isRedirecting}
              className="sr-only"
            />
            <label
              htmlFor="paymentMethod-cash"
              className="flex items-center justify-between mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    paymentMethod === "cash"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <Banknote className="size-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Cash on Delivery
                </span>
              </div>
              {paymentMethod === "cash" && (
                <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
              )}
            </label>
            <p className="text-xs text-muted-foreground">
              Pay in cash directly to the courier when your order arrives at your doorstep.
            </p>
          </div>

          <div
            onClick={() => handleSelectPaymentMethod("online")}
            className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${
              paymentMethod === "online"
                ? "border-primary bg-primary/5 shadow-xs"
                : "border-neutral-200 hover:border-neutral-300 bg-card"
            } ${isSubmitting || isRedirecting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              id="paymentMethod-online"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={() => handleSelectPaymentMethod("online")}
              disabled={isSubmitting || isRedirecting}
              className="sr-only"
            />
            <label
              htmlFor="paymentMethod-online"
              className="flex items-center justify-between mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex size-9 items-center justify-center rounded-lg ${
                    paymentMethod === "online"
                      ? "bg-primary text-primary-foreground"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <CreditCard className="size-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Online Payment
                </span>
              </div>
              {paymentMethod === "online" && (
                <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
              )}
            </label>
            <p className="text-xs text-muted-foreground">
              Secure payment via credit/debit card powered by Stripe Checkout.
            </p>
          </div>
        </div>

        {errors.paymentMethod && (
          <p className="mt-2 text-xs text-red-600 font-medium">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting || isRedirecting}
          className="w-full min-h-12 rounded-full text-base font-semibold transition-colors"
        >
          {isSubmitting || isRedirecting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span>
                {paymentMethod === "online"
                  ? "Connecting to Stripe..."
                  : "Placing Order..."}
              </span>
            </span>
          ) : paymentMethod === "online" ? (
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="size-5" aria-hidden="true" />
              <span>Proceed to Stripe Payment</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Banknote className="size-5" aria-hidden="true" />
              <span>Confirm Cash Order</span>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
