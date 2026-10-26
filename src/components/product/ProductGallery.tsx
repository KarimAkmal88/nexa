"use client"
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  title: string;
  imageCover: string;
  images: string[];
}
export default function ProductGallery({ title, imageCover, images }: ProductGalleryProps) {

    const galleryImages = [...new Set([imageCover, ...images].filter(Boolean))];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const selectedImage = galleryImages[selectedIndex];

    return (
        <section aria-label={`${title} images`} id="productGallery" className="min-w-0 space-y-4">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-primary-foreground p-7 sm:p-11">
                {
                    selectedImage && !failedImages.includes(selectedImage) ? (
                        <Image src={selectedImage} alt={`${title} - view ${selectedIndex + 1}`} fill unoptimized loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-7 sm:p-11" onError={() => setFailedImages((previous) => [...previous, selectedImage])} />
                    ) : (
                        <div className="flex flex-col items-center gap-2.5 text-primary">
                            <ImageOff aria-hidden='true' className="size-9" />
                            <p className="text-sm"> Image unavailable</p>
                        </div>
                    )
                }
                {
                    galleryImages.length > 1 && (
                        <span className="absolute right-4 bottom-4 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {selectedIndex + 1} / {galleryImages.length}
                        </span>
                    )
                }
            </div>
            {galleryImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto p-1" aria-label="Choose a product image">
                    {galleryImages.map((src, index) => (
                        <button key={src} type="button" aria-label={`Show ${title}, view ${index + 1}`} onClick={() => setSelectedIndex(index)} 
                        className={`relative size-20 shrink-0 overflow-hidden rounded-xl border bg-primary-foreground transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:size-24 ${selectedIndex === index ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-foreground/40'}`} >
                        {failedImages.includes(src) ? (
                            <ImageOff aria-hidden='true' className="mx-auto size-5 text-primary-foreground"/>
                        ) : (
                            <Image src={src} alt="" fill unoptimized sizes="96px" className="object-contain p-1.5"
                            onError={() => setFailedImages((previous) => [...previous, src])}
                            />
                        )}
                        </button>
                    ))}
                </div>
            )}
        </section>
    )
}
