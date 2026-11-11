import CategoryProductsPagination from "@/components/category/CategoryProductsPagination";
import ProductGrid from "@/components/product/ProductGrid";
import { getCategoryDetails, getSubcategories } from "@/services/categoriesService";
import { getProducts } from "@/services/productsService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryDetails({ params, searchParams }: {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{ page?: string; subcategory?: string }>;
}) {
    const { categoryId } = await params;
    const { page: rawPage, subcategory } = await searchParams;
    const page = Number(rawPage ?? "1");
    if (!/^[a-f\d]{24}$/i.test(categoryId) || !Number.isSafeInteger(page) || page < 1) notFound();
    if (subcategory !== undefined && !/^[a-f\d]{24}$/i.test(subcategory)) notFound();

    const [categoryResponse, subcategories] = await Promise.all([
        getCategoryDetails(categoryId),
        getSubcategories(categoryId),
    ]);
    if (!categoryResponse?.data) notFound();
    const category = categoryResponse.data;
    const selectedSubcategory = subcategories.find((item) => item._id === subcategory);
    if (subcategory && !selectedSubcategory) notFound();

    const { data: products, metadata } = await getProducts(page, { category: categoryId, subcategory });
    if (page > Math.max(1, metadata.numberOfPages)) notFound();
    const basePath = `/categories/${encodeURIComponent(categoryId)}`;

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
            <Link href="/categories" className="text-sm text-primary hover:underline">Back to categories</Link>
            <header className="my-8 flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 sm:flex-row">
                <Image src={category.image} alt={category.name} width={160} height={120} className="h-32 w-40 rounded-lg object-cover" unoptimized />
                <h1 className="text-3xl font-semibold tracking-tight text-primary">{category.name}</h1>
            </header>
            <section aria-labelledby="subcategories-heading" className="mb-8">
                <h2 id="subcategories-heading" className="mb-5 text-xl font-semibold">Subcategories</h2>
                {subcategories.length > 0 ? (
                    <nav aria-label="Filter products by subcategory" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Link href={basePath} aria-current={!subcategory ? "page" : undefined} className={`rounded-xl border p-4 text-center font-medium ${!subcategory ? "bg-primary text-primary-foreground" : "bg-card text-primary hover:border-primary"}`}>All products</Link>
                        {subcategories.map((item) => (
                            <Link key={item._id} href={`${basePath}?subcategory=${encodeURIComponent(item._id)}`} aria-current={subcategory === item._id ? "page" : undefined} className={`rounded-xl border p-4 text-center font-medium ${subcategory === item._id ? "bg-primary text-primary-foreground" : "bg-card text-primary hover:border-primary"}`}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                ) : <p className="rounded-2xl border bg-card p-6 text-muted-foreground">No subcategories available for {category.name} yet.</p>}
            </section>
            <section aria-labelledby="products-heading">
                <h2 id="products-heading" className="mb-5 text-xl font-semibold">{selectedSubcategory ? `${selectedSubcategory.name} products` : "Products"}</h2>
                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No products available for {selectedSubcategory?.name ?? category.name} yet.</p>}
                <CategoryProductsPagination currentPage={page} totalPages={metadata.numberOfPages} categoryId={categoryId} subcategory={subcategory} />
            </section>
        </main>
    );
}
