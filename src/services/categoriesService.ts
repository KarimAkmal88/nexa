import type {
  CategoryDetailsResponse,
  CategoriesResponse,
  SubcategoriesResponse,
} from "@/types/response";
import type { SubcategoryI } from "@/interfaces/subcategory";

const API_BASE_URL =
  process.env.API_BASE_URL || "https://ecommerce.routemisr.com";

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  return response.json();
}

export async function getCategoryDetails(
  categoryId: string
): Promise<CategoryDetailsResponse | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/categories/${encodeURIComponent(categoryId)}`
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status}`);
  }
  return response.json();
}

export async function getSubcategories(categoryId: string): Promise<SubcategoryI[]> {
  const subcategories: SubcategoryI[] = [];
  let numberOfPages = 1;
  for (let page = 1; page <= numberOfPages; page++) {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/categories/${encodeURIComponent(categoryId)}/subcategories?page=${page}&limit=40`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }
    const result: SubcategoriesResponse = await response.json();
    numberOfPages = result.metadata.numberOfPages;
    subcategories.push(...result.data);
  }
  return subcategories.filter((subcategory) => subcategory.category === categoryId);
}
