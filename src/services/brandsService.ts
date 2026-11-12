import type { BrandDetailsResponse, BrandsResponse } from "@/types/response";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://ecommerce.routemisr.com";

export async function getBrands(page: number = 1): Promise<BrandsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/brands?page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.status}`);
  }
  return response.json();
}

export async function getBrandDetails(
  brandId: string
): Promise<BrandDetailsResponse | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/brands/${encodeURIComponent(brandId)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch brand: ${response.status}`);
  }
  return response.json();
}
