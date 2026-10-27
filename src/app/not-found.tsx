import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="mb-4 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">404 · Page not found</p>
      <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-5xl">This page is out of reach</h1>
      <p className="mt-4 max-w-md text-muted-foreground">The page you’re looking for may have moved or is no longer available. Explore our products to find something you love.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Explore products</Link>
        <Link href="/" className="rounded-full border bg-card px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-muted">Back to home</Link>
      </div>
    </main>
  )
}
