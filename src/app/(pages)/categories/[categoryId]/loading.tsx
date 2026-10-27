import ProductsSkeleton from "@/components/product/ProductsSkeleton";

export default function CategoryDetailsLoading() {
    return (
        <div role="status" className="mx-auto w-full max-w-7xl px-4 py-8">
            <span className="sr-only">Loading category, subcategories, and products...</span>
            <div aria-hidden="true" className="motion-safe:animate-pulse">
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="my-8 flex flex-col items-center gap-6 rounded-2xl border bg-card p-6 sm:flex-row">
                    <div className="h-32 w-40 rounded-lg bg-muted" />
                    <div className="h-9 w-48 max-w-full rounded bg-muted" />
                </div>
                <div className="mb-5 h-7 w-40 rounded bg-muted" />
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-14 rounded-xl bg-muted" />)}
                </div>
                <div className="mb-5 h-7 w-28 rounded bg-muted" />
            </div>
            <ProductsSkeleton count={4} />
        </div>
    );
}
