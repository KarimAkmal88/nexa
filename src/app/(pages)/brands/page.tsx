
import BrandsPagination from "@/components/brand/BrandsPagination";
import { getBrands } from "@/services/brandsService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Brands({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const page = Number((await searchParams).page ?? "1");
    if (!Number.isSafeInteger(page) || page < 1) notFound();
    const { data: brands, metadata } = await getBrands(page);
    if (page > Math.max(1, metadata.numberOfPages)) notFound();
    return (
        <main className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-primary">Brands</h1>
            <p className="mb-8 text-muted-foreground">Explore products from your favorite brands.</p>
            {brands.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {brands.map((brand) => (
                        <Link key={brand._id} href={`/brands/${encodeURIComponent(brand._id)}`} className="group overflow-hidden rounded-2xl border bg-card p-5 transition-colors hover:border-primary">
                            <div className="relative aspect-video">
                                <Image src={brand.image} alt={brand.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain" unoptimized />
                            </div>
                            <h2 className="mt-4 text-center font-medium text-primary group-hover:underline">{brand.name}</h2>
                        </Link>
                    ))}
                </div>
            ) : <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No brands available right now.</p>}
            <BrandsPagination currentPage={page} totalPages={metadata.numberOfPages} basePath="/brands" />
        </main>
    );
}

