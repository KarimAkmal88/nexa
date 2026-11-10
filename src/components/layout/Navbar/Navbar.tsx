"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, ShoppingBag, X, User, LogOut, KeyRound, ChevronDown, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const links = [
  ["/", "Home"],
  ["/products", "Products"],
  ["/categories", "Categories"],
  ["/brands", "Brands"],
];

export default function Navbar() {
  return (
    <Suspense fallback={<Navigation pathname="" />}>
      <ActiveNavigation />
    </Suspense>
  );
}

function ActiveNavigation() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const { data: session, status } = useSession();
  const { numOfCartItems } = useCart();
  const { wishlistCount } = useWishlist();

  const active = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header
      className="border-b bg-card relative z-40"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (userMenuOpen) {
            setUserMenuOpen(false);
            userButtonRef.current?.focus();
          } else if (mobileOpen) {
            setMobileOpen(false);
            toggleRef.current?.focus();
          }
        }
      }}
    >
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Nexa home"
          onClick={() => {
            setMobileOpen(false);
            setUserMenuOpen(false);
          }}
          className="shrink-0 rounded-sm"
        >
          <Image
            src="/assets/logos/Minimalist Nexa Wordmark Logo.png"
            alt="Nexa"
            width={2160}
            height={728}
            className="h-auto w-36 sm:w-44"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                active(href)
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/75 hover:border-primary/30 hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/wishlist"
            aria-label={
              status === "authenticated" && wishlistCount > 0
                ? `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? "item" : "items"}`
                : "Wishlist"
            }
            aria-current={active("/wishlist") ? "page" : undefined}
            onClick={() => {
              setMobileOpen(false);
              setUserMenuOpen(false);
            }}
            className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-secondary ${
              active("/wishlist") ? "bg-secondary" : ""
            }`}
          >
            <div className="relative flex items-center">
              <Heart
                size={19}
                aria-hidden="true"
                className={
                  status === "authenticated" && wishlistCount > 0
                    ? "fill-rose-500 text-rose-500"
                    : ""
                }
              />
              {status === "authenticated" && wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white leading-none"
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Wishlist</span>
          </Link>

          <Link
            href="/cart"
            aria-label={
              status === "authenticated" && numOfCartItems > 0
                ? `Cart, ${numOfCartItems} ${numOfCartItems === 1 ? "item" : "items"}`
                : "Cart"
            }
            aria-current={active("/cart") ? "page" : undefined}
            onClick={() => {
              setMobileOpen(false);
              setUserMenuOpen(false);
            }}
            className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium hover:bg-secondary ${
              active("/cart") ? "bg-secondary" : ""
            }`}
          >
            <div className="relative flex items-center">
              <ShoppingBag size={19} aria-hidden="true" />
              {status === "authenticated" && numOfCartItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground leading-none"
                >
                  {numOfCartItems > 99 ? "99+" : numOfCartItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2">
            {status === "authenticated" && session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  ref={userButtonRef}
                  type="button"
                  id="user-menu-button"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-controls="user-menu-dropdown"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  <User className="size-4 text-primary" />
                  <span className="max-w-[120px] truncate">{session.user.name || "My Account"}</span>
                  <ChevronDown className="size-3.5 text-neutral-500" />
                </button>

                {userMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 bg-card py-1.5 shadow-lg animate-in fade-in-0 zoom-in-95"
                  >
                    <div className="px-3.5 py-2 border-b border-neutral-100">
                      <p className="text-xs text-neutral-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-neutral-900">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/change-password"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-neutral-700 hover:bg-secondary transition-colors"
                    >
                      <KeyRound className="size-4 text-neutral-500" />
                      Change Password
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : status === "loading" ? (
              <div className="h-9 w-20 bg-neutral-100 animate-pulse rounded-md" />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-secondary md:hidden"
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className="border-t px-5 py-4 md:hidden space-y-3 bg-card"
      >
        <div className="space-y-1">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary ${
                active(href) ? "bg-secondary text-primary" : ""
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            aria-current={active("/wishlist") ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-secondary ${
              active("/wishlist") ? "bg-secondary text-primary" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart
                size={18}
                aria-hidden="true"
                className={
                  status === "authenticated" && wishlistCount > 0
                    ? "fill-rose-500 text-rose-500"
                    : "text-neutral-500"
                }
              />
              <span>Wishlist</span>
            </div>
            {status === "authenticated" && wishlistCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Auth Links */}
        <div className="border-t border-neutral-100 pt-3">
          {status === "authenticated" && session?.user ? (
            <div className="space-y-1">
              <div className="px-4 py-1.5">
                <p className="text-xs text-neutral-500 font-medium">Signed in as</p>
                <p className="text-sm font-semibold truncate text-neutral-900">
                  {session.user.name || session.user.email}
                </p>
              </div>
              <Link
                href="/change-password"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-secondary"
              >
                <KeyRound className="size-4 text-neutral-500" />
                Change Password
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
