import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsPagination({ currentPage, totalPages, basePath }: { currentPage: number; totalPages: number; basePath: string }) {
    if (totalPages <= 1) return null;
    return (
        <Pagination className="mt-8">
            <PaginationContent className="flex-wrap">
                {currentPage > 1 && <PaginationItem><PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} /></PaginationItem>}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink href={`${basePath}?page=${page}`} isActive={page === currentPage}>{page}</PaginationLink>
                    </PaginationItem>
                ))}
                {currentPage < totalPages && <PaginationItem><PaginationNext href={`${basePath}?page=${currentPage + 1}`} /></PaginationItem>}
            </PaginationContent>
        </Pagination>
    );
}
