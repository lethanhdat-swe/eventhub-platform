import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions, AdminEmptyState, AdminLoadingState, AdminPagination,
} from '@/pages/(admin)/components/table';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import BlogCategoryTable from './components/BlogCategoryTable/BlogCategoryTable';
import BlogCategoryFormDialog from './components/BlogCategoryFormDialog/BlogCategoryFormDialog';
import DeleteBlogCategoryDialog from './components/DeleteBlogCategoryDialog/DeleteBlogCategoryDialog';

function BlogCategories() {
  const {
    categories, meta, isLoading, error,
    searchInput, setSearchInput, setPage,
    selectedIds, handleSelectAll, handleSelectRow,
    formDialog, setFormDialog,
    deleteDialog, setDeleteDialog,
    deleteSubmitting,
    loadCategories, handleSaveCategory, handleDeleteConfirm,
  } = useBlogCategories();

  const isEmpty = !isLoading && categories.length === 0;

  const formInitialValues = formDialog?.mode === 'edit'
    ? { name: formDialog.category.name, slug: formDialog.category.slug }
    : { name: '', slug: '' };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý danh mục blog"
        description="Tạo và quản lý các danh mục dùng để phân loại bài viết."
        actionLabel="Thêm danh mục"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && categories.length > 0 && (
        <div className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" className="h-8 cursor-pointer shrink-0" onClick={() => void loadCategories()}>
            Thử lại
          </Button>
        </div>
      )}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm danh mục blog..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions selectedCount={selectedIds.size} label={`Đã chọn ${selectedIds.size} danh mục`}>
        <Button type="button" variant="destructive" className="px-3 h-9" onClick={() => setDeleteDialog({ type: 'bulk' })}>
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={5} minWidth="min-w-[760px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? { title: 'Không tải được danh sách', description: error, actionLabel: 'Thử lại', onAction: () => void loadCategories() }
            : { title: 'Chưa có danh mục blog', description: 'Thêm danh mục để phân loại bài viết.', actionLabel: 'Thêm danh mục', onAction: () => setFormDialog({ mode: 'create' }) }
          )}
        />
      ) : (
        <>
          <BlogCategoryTable
            categories={categories} selectedIds={selectedIds}
            onSelectAll={handleSelectAll} onSelectRow={handleSelectRow}
            onEdit={(category) => setFormDialog({ mode: 'edit', category })}
            onDelete={(category) => setDeleteDialog({ type: 'single', category })}
          />
          <AdminPagination
            currentPage={meta.currentPage} totalPages={meta.totalPages}
            totalItems={meta.totalItems} pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <BlogCategoryFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(open) => { if (!open) setFormDialog(null); }}
        onSave={handleSaveCategory}
      />

      <DeleteBlogCategoryDialog
        open={Boolean(deleteDialog)}
        isBulk={deleteDialog?.type === 'bulk'}
        categoryName={deleteDialog?.category?.name ?? ''}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => { if (!deleteSubmitting) setDeleteDialog(null); }}
      />
    </div>
  );
}

export default BlogCategories;