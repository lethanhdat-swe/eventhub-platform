import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function EventPagination({ currentPage, totalPages, onPageChange }) {
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pages = getPages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (isFirstPage) return;
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (isLastPage) return;
    onPageChange(currentPage + 1);
  };

  return (
    <Pagination className="mt-2">
      <PaginationContent className="gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--soft-surface-color)] p-1.5 backdrop-blur-xl">
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={`
              h-9 rounded-xl border border-transparent px-3
              text-xs font-bold text-[var(--muted-text)]
              transition-all duration-200
              ${
                isFirstPage
                  ? 'pointer-events-none opacity-35'
                  : 'cursor-pointer hover:border-[var(--primary-color)]/40 hover:bg-[var(--primary-color)]/10 hover:text-[var(--text-primary)] active:scale-95'
              }
            `}
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === '...' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis className="size-9 text-[var(--muted-text)] opacity-70" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={`
                  size-9 rounded-xl border text-xs font-black
                  transition-all duration-200
                  ${
                    currentPage === page
                      ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white shadow-[0_10px_28px_rgba(124,58,237,0.34)]'
                      : 'border-transparent text-[var(--muted-text)] hover:border-[var(--primary-color)]/35 hover:bg-[var(--primary-color)]/10 hover:text-[var(--text-primary)] active:scale-95'
                  }
                `}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={`
              h-9 rounded-xl border border-transparent px-3
              text-xs font-bold text-[var(--muted-text)]
              transition-all duration-200
              ${
                isLastPage
                  ? 'pointer-events-none opacity-35'
                  : 'cursor-pointer hover:border-[var(--primary-color)]/40 hover:bg-[var(--primary-color)]/10 hover:text-[var(--text-primary)] active:scale-95'
              }
            `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default EventPagination;
