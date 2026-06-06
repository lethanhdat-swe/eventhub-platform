import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/http/apiError';
import { blogCategoryService } from '@/lib/services/blogCategory/blogCategoryService';
import { mapBlogCategoryRow } from '@/pages/(admin)/BlogCategories/data';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 10;

export function useBlogCategories({ sortBy, sortOrder } = {}) {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);
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

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await blogCategoryService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });
      setCategories((payload.items ?? []).map(mapBlogCategoryRow));
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
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => { void loadCategories(); }, [loadCategories]);

  const handleSelectAll = (checked) =>
    setSelectedIds(checked ? new Set(categories.map((c) => c.id)) : new Set());

  const handleSelectRow = (id, checked) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });

  const handleSaveCategory = async ({ name, slug }) => {
    setError(null);
    try {
      if (formDialog?.mode === 'create') {
        await blogCategoryService.create({ name, slug });
        toast.success('Tạo danh mục thành công');
      } else if (formDialog?.mode === 'edit') {
        await blogCategoryService.update(formDialog.category.id, { name, slug });
        toast.success('Cập nhật danh mục thành công');
      }
      setFormDialog(null);
      await loadCategories();
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
        toast.success(`Đã xóa ${selectedIds.size} danh mục`);
        setSelectedIds(new Set());
      } else {
        await blogCategoryService.deleteMany([deleteDialog.category.id]);
        toast.success(`Đã xóa danh mục "${deleteDialog.category.name}"`);
        setSelectedIds((prev) => { const next = new Set(prev); next.delete(deleteDialog.category.id); return next; });
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

  return {
    categories, meta, isLoading, error,
    searchInput, setSearchInput, setPage,
    selectedIds, handleSelectAll, handleSelectRow,
    formDialog, setFormDialog,
    deleteDialog, setDeleteDialog,
    deleteSubmitting,
    loadCategories, handleSaveCategory, handleDeleteConfirm,
  };
}