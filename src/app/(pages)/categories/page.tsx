
import categoriesApiServices from "@/services/categoriesService";
import Image from "next/image";
import Link from "next/link";

export default async function Categories() {
    const { data: categories } = await categoriesApiServices.getCategories();
    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-primary">Categories</h1>
            <p className="mb-8 text-muted-foreground">Find your next favorite across our categories.</p>
            {categories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link key={category._id} href={`/categories/${encodeURIComponent(category._id)}`} className="group overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary">
                            <div className="relative aspect-square bg-muted">
                                <Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" unoptimized />
                            </div>
                            <h2 className="p-5 text-center font-medium text-primary group-hover:underline">{category.name}</h2>
                        </Link>
                    ))}
                </div>
            ) : <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">No categories available right now.</p>}
        </main>
    );
}
