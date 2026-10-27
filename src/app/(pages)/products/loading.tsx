
import ProductsSkeleton from "@/components/product/ProductsSkeleton";

export default function ProductsLoading() {
    return (
        <div role="status" className="mx-auto w-full max-w-7xl py-4">
            <span className="sr-only">Loading products...</span>
            <ProductsSkeleton />
        </div>
    );
}
