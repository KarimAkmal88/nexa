export default function BrandsLoading() {
    return (
        <div role="status" className="mx-auto max-w-7xl px-4 py-8">
            <span className="sr-only">Loading brands...</span>
            <div aria-hidden="true" className="motion-safe:animate-pulse">
                <div className="mb-2 h-9 w-36 rounded bg-muted" />
                <div className="mb-8 h-6 w-72 max-w-full rounded bg-muted" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div key={index} className="rounded-2xl border bg-card p-5">
                            <div className="aspect-video rounded-lg bg-muted" />
                            <div className="mx-auto mt-4 h-6 w-20 max-w-full rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
