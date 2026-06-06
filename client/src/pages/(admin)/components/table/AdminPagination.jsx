import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

function AdminPagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className,
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const start = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const end = Math.min(safeCurrentPage * pageSize, totalItems);
  const canGoPrev = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < safeTotalPages;

  const handlePageClick = (event, page) => {
    event.preventDefault();
    onPageChange?.(page);
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <p className="text-xs text-muted-foreground">
        {totalItems > 0
          ? `Hiển thị ${start}–${end} / ${totalItems}`
          : 'Không có dữ liệu'}
      </p>
      <Pagination className="justify-end overflow-x-auto sm:mx-0">
        <PaginationContent className="flex w-max min-w-full items-center gap-0.5 sm:justify-end">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Trước"
              className={cn(!canGoPrev && 'pointer-events-none opacity-50')}
              aria-disabled={!canGoPrev}
              onClick={(event) => {
                if (canGoPrev) handlePageClick(event, safeCurrentPage - 1);
                else event.preventDefault();
              }}
            />
          </PaginationItem>
          {Array.from({ length: safeTotalPages }, (_, index) => index + 1).map(
            (page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === safeCurrentPage}
                  onClick={(event) => handlePageClick(event, page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Sau"
              className={cn(!canGoNext && 'pointer-events-none opacity-50')}
              aria-disabled={!canGoNext}
              onClick={(event) => {
                if (canGoNext) handlePageClick(event, safeCurrentPage + 1);
                else event.preventDefault();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default AdminPagination;
