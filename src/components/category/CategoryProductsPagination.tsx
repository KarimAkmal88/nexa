import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function CategoryProductsPagination({ currentPage, totalPages, categoryId, subcategory }: {
    currentPage: number;
    totalPages: number;
    categoryId: string;
    subcategory?: string;
}) {
    if (totalPages <= 1) return null;
    const pageHref = (page: number) => {
        const query = new URLSearchParams({ page: String(page) });
        if (subcategory) query.set("subcategory", subcategory);
        return `/categories/${encodeURIComponent(categoryId)}?${query}`;
    };
    return (
        <Pagination className="mt-8">
            <PaginationContent className="flex-wrap">
                {currentPage > 1 && <PaginationItem><PaginationPrevious href={pageHref(currentPage - 1)} /></PaginationItem>}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <PaginationItem key={page}><PaginationLink href={pageHref(page)} isActive={page === currentPage}>{page}</PaginationLink></PaginationItem>
                ))}
                {currentPage < totalPages && <PaginationItem><PaginationNext href={pageHref(currentPage + 1)} /></PaginationItem>}
            </PaginationContent>
        </Pagination>
    );
}
