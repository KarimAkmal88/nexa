import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious className={currentPage === 1 ? 'pointer-events-none' : ''} href={`/products?page=${currentPage - 1}`} tabIndex={currentPage === 1 ? -1 : undefined} aria-disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="/products" isActive={currentPage === 1}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`/products?page=2`} isActive={currentPage === 2}>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext className={currentPage === totalPages ? 'pointer-events-none ' : ''} href={`/products?page=${currentPage + 1}`} tabIndex={currentPage === totalPages ? -1 : undefined} aria-disabled={currentPage === totalPages} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
