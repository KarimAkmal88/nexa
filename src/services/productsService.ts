import type { ProductDetailsResponse, ProductsResponse } from "@/types/response";

export async function getProducts(
  page: number = 1,
  filters: { brand?: string; subcategory?: string; category?: string } = {}
): Promise<ProductsResponse> {
  const query = new URLSearchParams({ page: String(page) });
  if (filters.brand) query.set("brand", filters.brand);
  if (filters.subcategory) query.set("subcategory", filters.subcategory);
  if (filters.category) query.set("category[in]", filters.category);

  const response = await fetch(`${process.env.API_BASE_URL}/api/v1/products?${query}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
}

export async function getProductDetails(
  productId: string
): Promise<ProductDetailsResponse | null> {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/v1/products/${encodeURIComponent(productId)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status}`);
  }
  return response.json();
}
