import { ProductI } from "@/interfaces/product";
import { BrandI } from "@/interfaces/brand";
import { CategoryI } from "@/interfaces/category";
import { SubcategoryI } from "@/interfaces/subcategory";

type ResponseT<T> = {
    results: number;
    metadata: {
        currentPage: number;
        numberOfPages: number;
        limit: number;
        nextPage?: number;
        prevPage?: number;
    };
    data: T[]
}


export type ProductsResponse = ResponseT<ProductI>
export type BrandsResponse = ResponseT<BrandI>
export type BrandDetailsResponse = { data: BrandI }
export type ProductDetailsResponse = { data: ProductI } 
export type CategoriesResponse = ResponseT<CategoryI>
export type CategoryDetailsResponse = { data: CategoryI }
export type SubcategoriesResponse = ResponseT<SubcategoryI>
