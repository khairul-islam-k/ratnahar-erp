"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
};

/** Reusable pagination for APIs that return a total item count. */
export function Pagination({
  page,
  total,
  limit,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = Math.max(1, currentPage - siblingCount);
  const end = Math.min(totalPages, currentPage + siblingCount);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1 ${className ?? ""}`}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft aria-hidden="true" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {start > 1 && (
        <>
          <PageButton page={1} currentPage={currentPage} onPageChange={onPageChange} />
          {start > 2 && <span className="px-1 text-muted-foreground" aria-hidden="true">...</span>}
        </>
      )}

      {pages.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          page={pageNumber}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground" aria-hidden="true">...</span>}
          <PageButton page={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}

function PageButton({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const isCurrent = page === currentPage;

  return (
    <Button
      type="button"
      variant={isCurrent ? "default" : "outline"}
      size="icon-sm"
      onClick={() => onPageChange(page)}
      aria-label={`Go to page ${page}`}
      aria-current={isCurrent ? "page" : undefined}
    >
      {page}
    </Button>
  );
}
