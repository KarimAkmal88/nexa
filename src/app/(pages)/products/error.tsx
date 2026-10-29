"use client";

import type { ErrorInfo } from "next/error";

export default function ProductsError({ retry }: ErrorInfo) {
    return (
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h1 className="text-2xl font-semibold text-primary">Unable to load products</h1>
            <p role="alert" className="mt-3 text-muted-foreground">Something went wrong while loading this page. Please try again.</p>
            <button type="button" onClick={retry} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Try again</button>
        </main>
    );
}
