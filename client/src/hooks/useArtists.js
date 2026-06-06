import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/http/apiError';
import { artistService } from '@/lib/services/admin/artistService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PAGE_SIZE = 10;

export function useArtists({ sortBy, sortOrder } = {}) {
  const [artists, setArtists] = useState([]);
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

  // Reset page on search change
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const loadArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await artistService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      });
      setArtists(payload.data ?? []);
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setArtists([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => { void loadArtists(); }, [loadArtists]);

  // Selection
  const handleSelectAll = (checked) =>
    setSelectedIds(checked ? new Set(artists.map((a) => a.id)) : new Set());

  const handleSelectRow = (id, checked) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });

  // Save (create / edit)
  const handleSaveArtist = async ({ name, slug, avatarUrl, description }) => {
    setError(null);
    try {
      if (formDialog?.mode === 'create') {
        await artistService.create({
          name,
          ...(slug        ? { slug }        : {}),
          ...(avatarUrl   ? { avatarUrl }   : {}),
          ...(description ? { description } : {}),
        });
        toast.success('Tạo nghệ sĩ thành công');
      } else if (formDialog?.mode === 'edit') {
        await artistService.update(formDialog.artist.id, {
          name,
          ...(slug ? { slug } : {}),
          description,
          ...(avatarUrl === '' ? { avatarUrl: null } : avatarUrl ? { avatarUrl } : {}),
        });
        toast.success('Cập nhật nghệ sĩ thành công');
      }
      setFormDialog(null);
      await loadArtists();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Có lỗi xảy ra');
    }
  };

  // Delete (single / bulk)
  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;
    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await artistService.deleteMany([...selectedIds]);
        toast.success(`Đã xóa ${selectedIds.size} nghệ sĩ`);
        setSelectedIds(new Set());
      } else {
        await artistService.deleteMany([deleteDialog.artist.id]);
        toast.success(`Đã xóa nghệ sĩ "${deleteDialog.artist.name}"`);
        setSelectedIds((prev) => { const next = new Set(prev); next.delete(deleteDialog.artist.id); return next; });
      }
      setDeleteDialog(null);
      await loadArtists();
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message || 'Xóa nghệ sĩ thất bại');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return {
    // data
    artists, meta, isLoading, error,
    // search & page
    searchInput, setSearchInput, setPage,
    // selection
    selectedIds, handleSelectAll, handleSelectRow,
    // dialogs
    formDialog, setFormDialog,
    deleteDialog, setDeleteDialog,
    deleteSubmitting,
    // actions
    loadArtists, handleSaveArtist, handleDeleteConfirm,
  };
}