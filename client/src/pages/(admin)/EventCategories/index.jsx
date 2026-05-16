import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import CategoryFormDialog from '@/pages/(admin)/EventCategories/components/CategoryFormDialog';
import CategoryTable from '@/pages/(admin)/EventCategories/components/CategoryTable';
import DeleteCategoryDialog from '@/pages/(admin)/EventCategories/components/DeleteCategoryDialog';
import {
  filterCategories,
  MOCK_CATEGORIES,
} from '@/pages/(admin)/EventCategories/data';

function createCategoryId() {
  return `cat-${crypto.randomUUID().slice(0, 8)}`;
}

function EventCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const categoryStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      { value: 'active', label: 'Đang hoạt động' },
      { value: 'draft', label: 'Bản nháp' },
      { value: 'cancelled', label: 'Đã hủy' },
    ],
    []
  );

  const filteredCategories = useMemo(
    () =>
      filterCategories(categories, searchQuery, { status: statusFilter }),
    [categories, searchQuery, statusFilter]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredCategories.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredCategories.map((category) => category.id)));
    } else {
      setSelectedIds(new Set());
    }
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

  const handleSaveCategory = ({ name, slug }) => {
    if (formDialog?.mode === 'create') {
      setCategories((prev) => [
        ...prev,
        {
          id: createCategoryId(),
          name,
          slug,
          eventCount: 0,
          createdAt: new Date().toISOString(),
          status: 'draft',
        },
      ]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.category) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === formDialog.category.id
            ? { ...category, name, slug }
            : category
        )
      );
      setFormDialog(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setCategories((prev) =>
        prev.filter((category) => !selectedIds.has(category.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setCategories((prev) =>
      prev.filter((category) => category.id !== deleteDialog.category.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.category.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? { name: formDialog.category.name, slug: formDialog.category.slug }
      : { name: '', slug: '' };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteCategoryName = deleteDialog?.category?.name ?? '';

  const handleView = (category) => {
    console.log('[Category detail]', category);
  };

  const handleEdit = (category) => {
    setFormDialog({ mode: 'edit', category });
  };

  const handleToggleStatus = (category) => {
    const nextStatus =
      category.status === 'active' ? 'draft' : 'active';
    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleDelete = (category) => {
    setDeleteDialog({ type: 'single', category });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý danh mục sự kiện"
        description="Quản lý các nhóm sự kiện như âm nhạc, workshop, thể thao, hội thảo."
        actionLabel="Thêm danh mục"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm danh mục..."
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Trạng thái"
          options={categoryStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </AdminToolbar>

            <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} danh mục`}
      >
        <Button
            type="button"
            variant="destructive"
            className="h-9 px-3"
            onClick={() => setDeleteDialog({ type: 'bulk' })}
          >
            Xóa đã chọn
          </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={6} minWidth="min-w-[720px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.eventCategories}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <CategoryTable
                  categories={filteredCategories}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleView}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onViewEvents={() => navigate('/admin/events')}
                  onDelete={handleDelete}
                />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredCategories.length}
            pageSize={10}
          />
        </>
      )}


      <CategoryFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        categoryName={deleteCategoryName}
        selectedCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default EventCategories;
