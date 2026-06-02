import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import {
  AdminBulkActions, AdminEmptyState, AdminLoadingState,
  AdminPagination, ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
import { useArtists } from '@/hooks/useArtists';
import ArtistTable from './components/ArtistTable/ArtistTable';
import ArtistFormDialog from './components/ArtistFormDialog/ArtistFormDialog';
import DeleteArtistDialog from './components/DeleteArtistDialog/DeleteArtistDialog';

function Artists() {
  const {
    artists, meta, isLoading, error,
    searchInput, setSearchInput, setPage,
    selectedIds, handleSelectAll, handleSelectRow,
    formDialog, setFormDialog,
    deleteDialog, setDeleteDialog,
    deleteSubmitting,
    loadArtists, handleSaveArtist, handleDeleteConfirm,
  } = useArtists();

  const isEmpty = !isLoading && artists.length === 0;

  const formInitialValues = formDialog?.mode === 'edit'
    ? { name: formDialog.artist.name, slug: formDialog.artist.slug, avatarUrl: formDialog.artist.avatarUrl ?? '', description: formDialog.artist.description ?? '' }
    : { name: '', slug: '', avatarUrl: '', description: '' };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý nghệ sĩ"
        description="Quản lý danh sách ca sĩ, DJ, khách mời và nghệ sĩ tham gia sự kiện."
        actionLabel="Thêm nghệ sĩ"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      {error && artists.length > 0 && (
        <div className="flex flex-col gap-2 px-3 py-2 border rounded-lg border-destructive/25 bg-destructive/5 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-sm text-destructive">{error}</p>
          <Button type="button" variant="outline" size="sm" className="h-8 shrink-0" onClick={() => void loadArtists()}>
            Thử lại
          </Button>
        </div>
      )}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm nghệ sĩ..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <AdminBulkActions selectedCount={selectedIds.size} label={`Đã chọn ${selectedIds.size} nghệ sĩ`}>
        <Button type="button" variant="destructive" className="px-3 h-9" disabled={selectedIds.size === 0} onClick={() => setDeleteDialog({ type: 'bulk' })}>
          Xóa đã chọn
        </Button>
      </AdminBulkActions>

      {isLoading ? (
        <AdminLoadingState rows={6} columns={5} minWidth="min-w-[720px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...(error
            ? { title: 'Không tải được danh sách', description: error, actionLabel: 'Thử lại', onAction: () => void loadArtists() }
            : { ...ADMIN_EMPTY_STATES.artists, onAction: () => setFormDialog({ mode: 'create' }) }
          )}
        />
      ) : (
        <>
          <ArtistTable
            artists={artists} selectedIds={selectedIds}
            onSelectAll={handleSelectAll} onSelectRow={handleSelectRow}
            onEdit={(artist) => setFormDialog({ mode: 'edit', artist })}
            onDelete={(artist) => setDeleteDialog({ type: 'single', artist })}
          />
          <AdminPagination
            currentPage={meta.currentPage} totalPages={meta.totalPages}
            totalItems={meta.totalItems} pageSize={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <ArtistFormDialog
        open={Boolean(formDialog)}
        mode={formDialog?.mode ?? 'create'}
        initialValues={formInitialValues}
        onOpenChange={(open) => { if (!open) setFormDialog(null); }}
        onSave={handleSaveArtist}
      />

      <DeleteArtistDialog
        open={Boolean(deleteDialog)}
        isBulk={deleteDialog?.type === 'bulk'}
        artistName={deleteDialog?.artist?.name ?? ''}
        selectedCount={selectedIds.size}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => { if (!deleteSubmitting) setDeleteDialog(null); }}
      />
    </div>
  );
}

export default Artists;