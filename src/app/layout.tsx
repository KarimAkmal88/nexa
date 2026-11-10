import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  preload: true,
  style: 'normal',
});

export const metadata: Metadata = {
  title: "Nexa | Discover More. Shop Better",
  description: "Discover modern essentials across fashion, electronics, and lifestyle at Nexa",
};

export default function RootLayout({ children }: { children: ReactNode }) { 
  return (
    <html
      lang="en"
      className={cn(
        "h-full", 
        "antialiased", 
        "font-sans", 
        plusJakartaSans.variable 
      )}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-5 focus:py-3 focus:text-primary">Skip to content</a>
              <Navbar />
              <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">{children}</div>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
