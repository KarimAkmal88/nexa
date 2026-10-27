import type { ProductI } from "@/interfaces/product";
import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid({ products }: { products: ProductI[] }) {
    const centerCards = products.length < 4;

    return (
        <div className={centerCards ? "-mx-2 flex flex-wrap justify-center gap-y-4" : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"}>
            {products.map((product) => (
                <div key={product._id} className={centerCards ? "w-full min-w-0 px-2 md:w-1/2 lg:w-1/4" : "min-w-0"}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
