import { ProductDetailsResponse, ProductsResponse } from "@/types/response";


class ProductsApiServices {
    async getProducts(page: number = 1): Promise<ProductsResponse> {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}/api/v1/products?page=${page}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch products:", error);
            throw error;
        }
    }

    async getProductDetails(productId: string): Promise<ProductDetailsResponse> {
        try {
            const response = await fetch(process.env.API_BASE_URL + '/api/v1/products/' + productId);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data
        } catch (error) {
            console.error("Failed to fetch product details", error);
            throw error;
        }
    }

}

const productsApiServices = new ProductsApiServices();
export default productsApiServices;