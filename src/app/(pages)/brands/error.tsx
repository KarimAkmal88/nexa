"use client";

export default function BrandsError({ reset }: { reset: () => void }) {
    return (
        <div role="alert" className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold text-primary">Unable to load brands</h2>
            <p className="mt-3 text-muted-foreground">Something went wrong while loading this page. Please try again.</p>
            <button onClick={reset} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Try again</button>
        </div>
    );
}
