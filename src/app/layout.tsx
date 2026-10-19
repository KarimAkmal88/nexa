import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
