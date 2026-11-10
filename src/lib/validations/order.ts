import { z } from "zod";

export const shippingAddressSchema = z.object({
  details: z
    .string()
    .min(1, "Address details are required")
    .min(3, "Please provide more address details (at least 3 characters)"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^01[0125][0-9]{8}$/, "Must be a valid Egyptian mobile number (e.g. 01012345678)"),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City name must be at least 2 characters"),
  paymentMethod: z.enum(["cash", "online"], {
    message: "Please select a payment method",
  }),
});

export type ShippingFormData = z.infer<typeof shippingAddressSchema>;
