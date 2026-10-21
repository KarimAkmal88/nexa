import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CategoryI } from "@/interfaces/category";

export default function CategoryCard({ category }: { category: CategoryI }) {
  return (
    <Link href="/categories" className="group overflow-hidden rounded-2xl border bg-card hover:border-primary/40">
      <div className="relative aspect-[4/3] bg-muted"><Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" unoptimized /></div>
      <div className="flex items-center justify-between gap-3 p-5"><h3 className="font-semibold text-primary">{category.name}</h3><ArrowUpRight size={18} aria-hidden="true" /></div>
    </Link>
  );
}
