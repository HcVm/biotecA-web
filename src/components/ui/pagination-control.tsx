"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation"

export function PaginationControl({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Simple pagination logic for MVP */}
                {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    // Show first, last, current, and surrounding
                    if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                        return (
                            <PaginationItem key={p}>
                                <PaginationLink href={createPageURL(p)} isActive={p === currentPage}>
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    }
                    if (p === currentPage - 2 || p === currentPage + 2) {
                        return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>
                    }
                    return null
                })}

                <PaginationItem>
                    <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        aria-disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
