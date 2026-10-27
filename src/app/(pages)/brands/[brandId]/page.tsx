import BrandsPagination from "@/components/brand/BrandsPagination";
import ProductCard from "@/components/product/ProductCard";
import brandsApiServices from "@/services/brandsService";
import productsApiServices from "@/services/productsService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BrandDetails({ params, searchParams }: {
    params: Promise<{ brandId: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { brandId } = await params;
    const page = Number((await searchParams).page ?? "1");
    if (!/^[a-f\d]{24}$/i.test(brandId) || !Number.isSafeInteger(page) || page < 1) notFound();
    const brandResponse = await brandsApiServices.getBrandDetails(brandId);
    if (!brandResponse?.data) notFound();
    const brand = brandResponse.data;
    const { data: products, metadata } = await productsApiServices.getProducts(page, { brand: brandId });
    if (page > Math.max(1, metadata.numberOfPages)) notFound();
    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <Link href="/brands" className="text-sm text-primary hover:underline">Back to brands</Link>
            <header className="my-8 flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 sm:flex-row">
                <Image src={brand.image} alt={brand.name} width={160} height={100} className="h-24 w-40 object-contain" unoptimized />
                <h1 className="text-3xl font-semibold tracking-tight text-primary">{brand.name}</h1>
            </header>
            <h2 className="mb-5 text-xl font-semibold">Products</h2>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
            ) : <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No products available for {brand.name} yet.</p>}
            <BrandsPagination currentPage={page} totalPages={metadata.numberOfPages} basePath={`/brands/${encodeURIComponent(brandId)}`} />
        </main>
    );
}
