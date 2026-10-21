
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

const links = [["/", "Home"], ["/products", "Products"], ["/categories", "Categories"], ["/brands", "Brands"]];

export default function Navbar() {
  return <Suspense fallback={<Navigation pathname="" />}><ActiveNavigation /></Suspense>;
}

function ActiveNavigation() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="border-b bg-card" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); }
    }}>
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Nexa home" onClick={() => setOpen(false)} className="shrink-0 rounded-sm">
          <Image src="/assets/logos/Minimalist Nexa Wordmark Logo.png" alt="Nexa" width={2160} height={728} className="h-auto w-36 sm:w-44" priority />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`border-b-2 py-3 text-sm font-medium transition-colors ${active(href) ? "border-primary text-primary" : "border-transparent text-foreground/75 hover:border-primary/30 hover:text-primary"}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" aria-label="Cart" aria-current={active("/cart") ? "page" : undefined} onClick={() => setOpen(false)} className={`flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-secondary ${active("/cart") ? "bg-secondary" : ""}`}><ShoppingBag size={19} aria-hidden="true" /><span className="hidden sm:inline">Cart</span></Link>
          <button ref={toggle} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center rounded-full hover:bg-secondary md:hidden">{open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!open} className="border-t px-5 py-3 md:hidden">
        {links.map(([href, label]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} onClick={() => setOpen(false)} className={`block rounded-lg px-4 py-3 text-sm font-medium hover:bg-secondary ${active(href) ? "bg-secondary text-primary" : ""}`}>{label}</Link>)}
      </nav>
    </header>
  );
}
