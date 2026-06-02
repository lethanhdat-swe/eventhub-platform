import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { categoryService } from '@/lib/services/admin/categoryService';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import { AdminBulkActions } from '@/pages/(admin)/components/table';
import CategoryContent from './components/CategoryContent/CategoryContent';
import CategoryDialogs from './components/CategoryDialogs/CategoryDialogs';
import { useCategories } from '@/hooks/useCategories';

function EventCategories() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedIds, setSelectedIds] = useState(
    () => new Set(),
  );

  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const [deleteSubmitting, setDeleteSubmitting] =
    useState(false);

  const {
    categories,
    meta,
    setPage,
    error,
    setError,
    isLoading,
    loadCategories,
  } = useCategories(debouncedSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(
        new Set(categories.map((category) => category.id)),
      );
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

  const handleEdit = (category) => {
    setFormDialog({
      mode: 'edit',
      category,
    });
  };

  const handleDelete = (category) => {
    setDeleteDialog({
      type: 'single',
      category,
    });
  };

  const handleSaveCategory = async ({
    name,
    slug,
  }) => {
    setError(null);

    try {
      if (formDialog?.mode === 'create') {
        await categoryService.create({
          name,
          slug,
        });

        toast.success(
          'Tạo danh mục thành công',
        );

        setFormDialog(null);

        await loadCategories();
        return;
      }

      if (
        formDialog?.mode === 'edit' &&
        formDialog.category
      ) {
        await categoryService.update(
          formDialog.category.id,
          {
            name,
            slug,
          },
        );

        toast.success(
          'Cập nhật danh mục thành công',
        );

        setFormDialog(null);

        await loadCategories();
      }
    } catch (e) {
      const message = getErrorMessage(e);

      setError(message);

      toast.error(
        message || 'Có lỗi xảy ra',
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) {
      return;
    }

    setDeleteSubmitting(true);
    setError(null);

    try {
      if (deleteDialog.type === 'bulk') {
        await categoryService.deleteMany([
          ...selectedIds,
        ]);

        toast.success(
          `Đã xóa ${selectedIds.size} danh mục`,
        );

        setSelectedIds(new Set());
      } else {
        await categoryService.deleteMany([
          deleteDialog.category.id,
        ]);

        setSelectedIds((prev) => {
          const next = new Set(prev);

          next.delete(
            deleteDialog.category.id,
          );

          return next;
        });

        toast.success(
          `Đã xóa danh mục "${deleteDialog.category.name}"`,
        );
      }

      setDeleteDialog(null);

      await loadCategories();
    } catch (e) {
      const message = getErrorMessage(e);

      setError(message);

      toast.error(
        message ||
          'Xóa danh mục thất bại',
      );
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý danh mục sự kiện"
        description="Quản lý các nhóm sự kiện như âm nhạc, workshop, thể thao, hội thảo."
        actionLabel="Thêm danh mục"
        actionIcon={
          <Plus className="size-4" />
        }
        onAction={() =>
          setFormDialog({
            mode: 'create',
          })
        }
      />

      {error && categories.length > 0 && (
        <div
          role="alert"
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-destructive">
            {error}
          </p>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 cursor-pointer shrink-0"
            onClick={() =>
              void loadCategories()
            }
          >
            Thử lại
          </Button>
        </div>
      )}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm danh mục..."
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
          onClick={() =>
            setDeleteDialog({
              type: 'bulk',
            })
          }
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      <CategoryContent
        categories={categories}
        meta={meta}
        error={error}
        isLoading={isLoading}
        loadCategories={loadCategories}
        setPage={setPage}
        setFormDialog={setFormDialog}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryDialogs
        formDialog={formDialog}
        deleteDialog={deleteDialog}
        selectedIds={selectedIds}
        deleteSubmitting={deleteSubmitting}
        setFormDialog={setFormDialog}
        setDeleteDialog={setDeleteDialog}
        onSave={handleSaveCategory}
        onDeleteConfirm={() =>
          void handleDeleteConfirm()
        }
      />
    </div>
  );
}

export default EventCategories;
