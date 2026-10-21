import { ProductI } from "@/interfaces/product";

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
export type ProductDetailsResponse = { data: ProductI } 