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
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
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

  return (
    <Pagination className="mt-4">
      <PaginationContent className="gap-2">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`
                border border-transparent rounded-lg bg-[#0b0c10] text-gray-400
                transition-all duration-200 ease-out
                ${
                  currentPage === 1
                    ? 'pointer-events-none opacity-25'
                    : 'cursor-pointer hover:border-(--primary-color) hover:text-(--text-primary)/70 hover:bg-(--primary-color)/10 active:scale-95'
                }
        `}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis className="text-gray-500" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className={`
                  cursor-pointer rounded-lg border 
                  transition-all duration-200 ease-out
                  ${
                    currentPage === page
                      ? 'bg-(--primary-color) border-(--primary-color) text-white shadow-[0_0_16px_rgba(139,92,246,0.45)]'
                      : 'bg-transparent border-gray-700 text-gray-400 hover:border-(--primary-color) hover:text-(--text-primary)/70 hover:bg-(--primary-color)/10 active:scale-95'
                  }
                `}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`
              border border-transparent rounded-lg bg-[#0b0c10] text-gray-400
              transition-all duration-200 ease-out
              ${
                currentPage === totalPages
                  ? 'pointer-events-none opacity-25'
                  : 'cursor-pointer hover:border-(--primary-color) hover:text-(--text-primary)/70 hover:bg-(--primary-color)/10 active:scale-95'
              }
            `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default EventPagination;
