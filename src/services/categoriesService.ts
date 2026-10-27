import type { CategoryDetailsResponse, CategoriesResponse, SubcategoriesResponse } from "@/types/response";
import type { SubcategoryI } from "@/interfaces/subcategory";

class CategoriesApiServices {
    async getCategories(): Promise<CategoriesResponse> {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/categories`);
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
        return response.json();
    }

    async getCategoryDetails(categoryId: string): Promise<CategoryDetailsResponse | null> {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/categories/${encodeURIComponent(categoryId)}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Failed to fetch category: ${response.status}`);
        return response.json();
    }

    async getSubcategories(categoryId: string): Promise<SubcategoryI[]> {
        const subcategories: SubcategoryI[] = [];
        let numberOfPages = 1;
        // This endpoint returns an unfiltered collection. Read every page before filtering.
        // Explicit page and limit parameters returned consistent pagination in API probes.
        for (let page = 1; page <= numberOfPages; page++) {
            const response = await fetch(`${process.env.API_BASE_URL}/api/v1/categories/${encodeURIComponent(categoryId)}/subcategories?page=${page}&limit=40`);
            if (!response.ok) throw new Error(`Failed to fetch subcategories: ${response.status}`);
            const result: SubcategoriesResponse = await response.json();
            numberOfPages = result.metadata.numberOfPages;
            subcategories.push(...result.data);
        }
        return subcategories.filter((subcategory) => subcategory.category === categoryId);
    }
}

const categoriesApiServices = new CategoriesApiServices();
export default categoriesApiServices;
