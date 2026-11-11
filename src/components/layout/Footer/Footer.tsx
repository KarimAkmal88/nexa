
import Link from "next/link";

export default  function Footer() {
  
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-sm">
            <Link href="/" aria-label="Nexa home" className="inline-block rounded-sm text-4xl font-bold tracking-tighter focus-visible:outline-primary-foreground">nexa<span className="text-accent">.</span></Link>
            <p className="mt-4 text-sm leading-7 text-primary-foreground/75">A fresh perspective on everyday shopping. Explore more of what fits your life, all in one place.</p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 content-start gap-x-12 gap-y-4 text-sm sm:pt-3">
            {[["/", "Home"], ["/products", "Products"], ["/categories", "Categories"], ["/brands", "Brands"], ["/cart", "Cart"]].map(([href, label]) => <Link key={href} href={href} className="rounded-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:underline underline-offset-4 focus-visible:outline-primary-foreground">{label}</Link>)}
          </nav>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/70 sm:flex-row">
          <p>© 2026 Nexa. All rights reserved.</p>
          <p className="tracking-widest">DISCOVER MORE. SHOP BETTER.</p>
        </div>
      </div>
    </footer>
  );
}
