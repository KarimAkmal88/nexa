import ProductCard from "@/components/product/ProductCard";
import ProductPagination from "@/components/product/ProductsPagination";
import productsApiServices from "@/services/productsService";
import { notFound } from "next/navigation";

interface ProductsProps {
    searchParams: Promise<{ page?: string }>
}

export default async function Products({ searchParams }: ProductsProps) {

    const resolvedParams = await searchParams;
    const rawPage = resolvedParams.page;
    const parsedPage = Number(rawPage ?? "1");
    const isValidPositiveInteger =
        !Number.isNaN(parsedPage) &&
        Number.isInteger(parsedPage) &&
        parsedPage > 0;

    if (!isValidPositiveInteger) {
        notFound()
    }

    const { metadata, data: products } = await productsApiServices.getProducts(parsedPage);

    if (parsedPage > metadata.numberOfPages) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard product={product} key={product._id} />
                ))}
            </div>
            <div className="mt-4 mb-2">
                {metadata && (
                <ProductPagination currentPage={parsedPage} totalPages={metadata.numberOfPages} />
            )}
            </div>
        </div>
    )
}
