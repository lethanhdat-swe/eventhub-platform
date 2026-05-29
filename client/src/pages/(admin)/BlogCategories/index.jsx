import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
} from '@/pages/(admin)/components/table';
import BlogCategoryFormDialog from '@/pages/(admin)/BlogCategories/components/BlogCategoryFormDialog';
import BlogCategoryTable from '@/pages/(admin)/BlogCategories/components/BlogCategoryTable';
import DeleteBlogCategoryDialog from '@/pages/(admin)/BlogCategories/components/DeleteBlogCategoryDialog';
import { mapBlogCategoryRow } from '@/pages/(admin)/BlogCategories/data';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await blogCategoryService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
      });

      const rows = payload.items ?? [];
      setCategories(rows.map(mapBlogCategoryRow));

      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(categories.map((category) => category.id)));
      return;
    }

    setSelectedIds(new Set());
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

 const handleSaveCategory = async ({ name, slug }) => {
    setError(null);

    try {
      if (formDialog?.mode === 'create') {
        await blogCategoryService.create({ name, slug });
        toast.success('Tạo danh mục thành công');
        setFormDialog(null);
        await loadCategories();
        return;
      }

      if (formDialog?.mode === 'edit' && formDialog.category) {
        await blogCategoryService.update(formDialog.category.id, { name, slug });
        toast.success('Cập nhật danh mục thành công');
        setFormDialog(null);
        await loadCategories();
      }
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await blogCategoryService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} danh mục`);
      } else {
        await blogCategoryService.deleteMany([deleteDialog.category.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.category.id);
          return next;
        });
        toast.success(`Đã xóa danh mục "${deleteDialog.category.name}"`);
      }
      setDeleteDialog(null);
      await loadCategories();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa danh mục thất bại');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormDialog({ mode: 'edit', category });
  };

  const handleDelete = (category) => {
    setDeleteDialog({ type: 'single', category });
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? { name: formDialog.category.name, slug: formDialog.category.slug }
      : { name: '', slug: '' };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteCategoryName = deleteDialog?.category?.name ?? '';
  const isEmpty = !isLoading && categories.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý danh mục blog"
        description="Tạo và quản lý các danh mục dùng để phân loại bài viết."
        actionLabel="Thêm danh mục"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && categories.length > 0 ? (
        <div
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer shrink-0"
            onClick={() => void loadCategories()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm danh mục blog..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} danh mục`}
      >
        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={5} minWidth="min-w-[760px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadCategories(),
              }
            : {
                title: 'Chưa có danh mục blog',
                description: 'Thêm danh mục để phân loại bài viết.',
                actionLabel: 'Thêm danh mục',
                onAction: () => setFormDialog({ mode: 'create' }),
              })}
        />
      ) : (
        <>
          <BlogCategoryTable
            categories={categories}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <AdminPagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <BlogCategoryFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveCategory}
      />

      <DeleteBlogCategoryDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        categoryName={deleteCategoryName}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default BlogCategories;
