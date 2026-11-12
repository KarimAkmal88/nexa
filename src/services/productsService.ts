import type { ProductDetailsResponse, ProductsResponse } from "@/types/response";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://ecommerce.routemisr.com";

export async function getProducts(
  page: number = 1,
  filters: { brand?: string; subcategory?: string; category?: string } = {}
): Promise<ProductsResponse> {
  const query = new URLSearchParams({ page: String(page) });
  if (filters.brand) query.set("brand", filters.brand);
  if (filters.subcategory) query.set("subcategory", filters.subcategory);
  if (filters.category) query.set("category[in]", filters.category);

  const response = await fetch(`${API_BASE_URL}/api/v1/products?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
}

export async function getProductDetails(
  productId: string
): Promise<ProductDetailsResponse | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/products/${encodeURIComponent(productId)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status}`);
  }
  return response.json();
}
