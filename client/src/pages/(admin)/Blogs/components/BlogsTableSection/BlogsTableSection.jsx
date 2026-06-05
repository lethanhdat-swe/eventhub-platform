import { AdminPagination } from '@/pages/(admin)/components/table';
import BlogTable from '../BlogTable/BlogTable';

function BlogsTableSection({
  blogs,
  meta,
  selectedIds,
  sortBy,
  sortOrder,
  onSort,
  onSelectAll,
  onSelectRow,
  onEdit,
  onDelete,
  onPageChange,
}) {
  return (
    <>
      <BlogTable
        blogs={blogs}
        selectedIds={selectedIds}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <AdminPagination
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
        totalItems={meta.totalItems}
        pageSize={meta.itemsPerPage}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default BlogsTableSection;