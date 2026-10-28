import ProductGallery from "@/components/product/ProductGallery";
import productsApiServices from "@/services/productsService";
import { ArrowLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductDetailsProps {
    params: Promise<{ productId: string }>;
}
export default async function ProductDetails({ params }: ProductDetailsProps) {

    const resolvedParams = await params;
    const productId = resolvedParams.productId;
    if (!/^[a-f\d]{24}$/i.test(productId)) notFound();
    const response = await productsApiServices.getProductDetails(productId);
    if (response === null) {
        notFound();
    }
    const productDetails = response.data;

    const inStock = productDetails.quantity > 0;
    const discounted = productDetails.priceAfterDiscount != null && productDetails.priceAfterDiscount < productDetails.price;

    return (
        <main className="max-w-7xl mx-auto p-4 mt-3 mb-3 w-full">
            <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
                <Link
                    href="/products"
                    className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                    Products
                </Link>
                <ChevronRight aria-hidden="true" className="size-3.5" />
                <span>{productDetails.category.name}</span>
                <ChevronRight aria-hidden="true" className="size-3.5" />
                <span aria-current="page" className="min-w-0 line-clamp-3 text-foreground lg:truncate">
                    {productDetails.title}
                </span>
            </nav>
            <div className="grid items-start gap-10 grid-cols-1 lg:grid-cols-5 lg:gap-16">
                <div className="lg:col-span-2">
                    <ProductGallery
                        key={productDetails._id}
                        title={productDetails.title}
                        imageCover={productDetails.imageCover}
                        images={productDetails.images}
                    />
                </div>
                <section aria-labelledby="product-title" className="min-w-0 py-2 lg:py-4 lg:col-span-3">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-primary/20 px-3 py-1.5 text-xs font-semibold tracking-wide text-foreground">
                            {productDetails.category.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            By {productDetails.brand.name}
                        </span>
                    </div>
                    <h2 id="product-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-5xl">
                        {productDetails.title}
                    </h2>
                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                        {productDetails.ratingsQuantity > 0 ? (
                            <>
                                <span className="inline-flex items-center gap-1">
                                    <Star aria-hidden='true' className="size-3.5 fill-orange-400 text-orange-400" />
                                    <span className="font-semibold">
                                        {productDetails.ratingsAverage.toFixed(1)}
                                        <span className="font-normal text-muted-foreground"> / 5</span>
                                    </span>
                                </span>
                                <span className="text-muted-foreground">
                                    {productDetails.ratingsQuantity.toLocaleString('en-US')} ratings
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">No ratings yet</span>
                        )}
                        <span className="border-l pl-3.5 text-muted-foreground">
                            {productDetails.sold.toLocaleString('en-US')} sold
                        </span>
                    </div>
                    <div className="my-7 rounded-xl border bg-muted/35 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Price
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
                            {discounted ? productDetails.priceAfterDiscount : productDetails.price} EGP
                        </p>
                        {discounted && (
                            <del className="mt-1 block text-sm text-muted-foreground">
                                <span className="sr-only">Original price: </span>{productDetails.price} EGP
                            </del>
                        )}
                        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                            <span
                                className={`size-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
                                aria-hidden="true"
                            />
                            <span className="font-medium">
                                {inStock ? "In stock" : "Out of stock"}
                            </span>
                            {inStock && (
                                <span className="text-muted-foreground">
                                    · {productDetails.quantity.toLocaleString("en-US")} available
                                </span>
                            )}
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold">About this product</h3>
                    <p className="mt-2.5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                        {productDetails.description || 'No description available for this product.'}
                    </p>
                    <div className="mt-7 border-t pt-5">
                        <h3 className="text-sm font-semibold">Product details</h3>
                        <dl className="mt-3.5 divide-y text-sm">
                            {[
                                ["Brand", productDetails.brand.name],
                                ["Category", productDetails.category.name],
                                [
                                    "Subcategory",
                                    productDetails.subcategory
                                        .map((item) => item.name)
                                        .join(", "),
                                ],
                            ]
                                .filter(([, value]) => value)
                                .map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="grid grid-cols-[6rem_1fr] gap-4 py-3"
                                    >
                                        <dt className="text-muted-foreground">{label}</dt>
                                        <dd className="font-medium">{value}</dd>
                                    </div>
                                ))}
                        </dl>
                    </div>
                    <div className="mt-7">
                        {/* add to cart button */}
                    </div>
                    <Link href='/products' className="mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2">
                        <ArrowLeft aria-hidden='true' className="size-4" />
                        Continue shopping
                    </Link>
                </section>
            </div>
        </main>
    )
}
