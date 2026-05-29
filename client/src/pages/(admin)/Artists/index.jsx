import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { artistService } from '@/lib/services/admin/artistService';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import ArtistFormDialog from '@/pages/(admin)/Artists/components/ArtistFormDialog';
import ArtistTable from '@/pages/(admin)/Artists/components/ArtistTable';
import DeleteArtistDialog from '@/pages/(admin)/Artists/components/DeleteArtistDialog';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function Artists() {
  const [artists, setArtists] = useState([]);
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

  const loadArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await artistService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
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
  }, [page, debouncedSearch]);

  useEffect(() => {
    void loadArtists();
  }, [loadArtists]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(artists.map((artist) => artist.id)));
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

  const handleSaveArtist = async ({ name, slug, avatarUrl, description }) => {
    setError(null);

    try {
      if (formDialog?.mode === 'create') {
        await artistService.create({
          name,
          ...(slug ? { slug } : {}),
          ...(avatarUrl ? { avatarUrl } : {}),
          ...(description ? { description } : {}),
        });
        toast.success('Tạo nghệ sĩ thành công');
        setFormDialog(null);
        await loadArtists();
        return;
      }

      if (formDialog?.mode === 'edit' && formDialog.artist) {
        await artistService.update(formDialog.artist.id, {
          name,
          ...(slug ? { slug } : {}),
          description,
          ...(avatarUrl === ''
            ? { avatarUrl: null }
            : avatarUrl
              ? { avatarUrl }
              : {}),
        });
        toast.success('Cập nhật nghệ sĩ thành công');
        setFormDialog(null);
        await loadArtists();
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
        await artistService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
        toast.success(`Đã xóa ${selectedIds.size} nghệ sĩ`);
      } else {
        await artistService.deleteMany([deleteDialog.artist.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.artist.id);
          return next;
        });
        toast.success(`Đã xóa nghệ sĩ "${deleteDialog.artist.name}"`);
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

  const handleEdit = (artist) => {
    setFormDialog({ mode: 'edit', artist });
  };

  const handleDelete = (artist) => {
    setDeleteDialog({ type: 'single', artist });
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.artist.name,
          slug: formDialog.artist.slug,
          avatarUrl: formDialog.artist.avatarUrl ?? '',
          description: formDialog.artist.description ?? '',
        }
      : {
          name: '',
          slug: '',
          avatarUrl: '',
          description: '',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteArtistName = deleteDialog?.artist?.name ?? '';

  const isEmpty = !isLoading && artists.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý nghệ sĩ"
        description="Quản lý danh sách ca sĩ, DJ, khách mời và nghệ sĩ tham gia sự kiện."
        actionLabel="Thêm nghệ sĩ"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && artists.length > 0 ? (
        <div
          className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadArtists()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm nghệ sĩ..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} nghệ sĩ`}
      >
        <Button
          type="button"
          variant="destructive"
          className="px-3 h-9"
          disabled={selectedIds.size === 0}
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={5} minWidth="min-w-[720px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadArtists(),
              }
            : {
                ...ADMIN_EMPTY_STATES.artists,
                onAction: () => setFormDialog({ mode: 'create' }),
              })}
        />
      ) : (
        <>
          <ArtistTable
            artists={artists}
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

      <ArtistFormDialog
        open={formDialogOpen}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(isOpen) => {
          if (!isOpen) setFormDialog(null);
        }}
        onSave={handleSaveArtist}
      />

      <DeleteArtistDialog
        open={deleteDialogOpen}
        isBulk={deleteIsBulk}
        artistName={deleteArtistName}
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

export default Artists;
