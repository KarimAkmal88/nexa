import type { ProductI } from "@/interfaces/product";

export interface WishlistResponse {
  status: string;
  count: number;
  data: ProductI[];
}

export interface WishlistMutationResponse {
  status: string;
  message: string;
  data: string[];
}

export interface WishlistErrorPayload {
  statusMsg?: string;
  message?: string;
}
