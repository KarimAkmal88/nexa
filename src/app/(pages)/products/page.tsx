import ProductCard from "@/components/product/ProductCard";
import ProductPagination from "@/components/product/ProductsPagination";
import productsApiServices from "@/services/productsService";
import Link from "next/link";
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

    if (parsedPage > Math.max(1, metadata.numberOfPages)) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto pt-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.length > 0 ? products.map((product) => (
                    <ProductCard product={product} key={product._id} />
                )) : (
                    <div className="col-span-full mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-5xl">No products available</h1>
                        <p className="mt-4 max-w-md text-muted-foreground">There are no products to display right now. Check back later.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link href="/" className="rounded-full border bg-card px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted">Back to home</Link>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 mb-2">
                {metadata && (
                <ProductPagination currentPage={parsedPage} totalPages={metadata.numberOfPages} basePath="/products" />
            )}
            </div>
        </div>
    )
}
