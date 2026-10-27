export default function ProductsSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div aria-hidden="true" className="grid grid-cols-1 gap-4 motion-safe:animate-pulse md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border bg-card">
                    <div className="aspect-square bg-muted" />
                    <div className="space-y-3 p-5">
                        <div className="h-6 w-full rounded bg-muted" />
                        <div className="h-6 w-2/3 rounded bg-muted" />
                        <div className="h-5 w-24 rounded bg-muted" />
                        <div className="h-4 w-36 max-w-full rounded bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}
