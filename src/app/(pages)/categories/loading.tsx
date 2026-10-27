export default function CategoriesLoading() {
    return (
        <div role="status" className="mx-auto w-full max-w-7xl px-4 py-8">
            <span className="sr-only">Loading categories...</span>
            <div aria-hidden="true" className="motion-safe:animate-pulse">
                <div className="mb-2 h-9 w-48 rounded bg-muted" />
                <div className="mb-8 h-6 w-72 max-w-full rounded bg-muted" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <div key={index} className="overflow-hidden rounded-2xl border bg-card">
                            <div className="aspect-square bg-muted" />
                            <div className="p-5"><div className="mx-auto h-6 w-32 rounded bg-muted" /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
