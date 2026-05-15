import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import {
  filterArtists,
  getRoleLabel,
  MOCK_ARTISTS,
} from '@/pages/(admin)/Artists/data';

function createArtistId() {
  return `art-${crypto.randomUUID().slice(0, 8)}`;
}

function Artists() {
  const [artists, setArtists] = useState(MOCK_ARTISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [formDialog, setFormDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const filteredArtists = useMemo(
    () => filterArtists(artists, searchQuery),
    [artists, searchQuery]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredArtists.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredArtists.map((artist) => artist.id)));
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

  const handleSaveArtist = ({
    name,
    slug,
    avatarUrl,
    role,
    description,
  }) => {
    const roleLabel = getRoleLabel(role);
    const now = new Date().toISOString();

    if (formDialog?.mode === 'create') {
      setArtists((prev) => [
        ...prev,
        {
          id: createArtistId(),
          name,
          slug,
          avatarUrl: avatarUrl || null,
          description,
          role,
          roleLabel,
          eventCount: 0,
          createdAt: now,
          updatedAt: now,
          status: 'draft',
        },
      ]);
      setFormDialog(null);
      return;
    }

    if (formDialog?.mode === 'edit' && formDialog.artist) {
      setArtists((prev) =>
        prev.map((artist) =>
          artist.id === formDialog.artist.id
            ? {
                ...artist,
                name,
                slug,
                avatarUrl: avatarUrl || null,
                description,
                role,
                roleLabel,
                updatedAt: now,
              }
            : artist
        )
      );
      setFormDialog(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setArtists((prev) =>
        prev.filter((artist) => !selectedIds.has(artist.id))
      );
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setArtists((prev) =>
      prev.filter((artist) => artist.id !== deleteDialog.artist.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.artist.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const handleViewArtist = (artist) => {
    console.log('[Artist detail]', artist.id);
  };

  const formDialogOpen = Boolean(formDialog);
  const formInitialValues =
    formDialog?.mode === 'edit'
      ? {
          name: formDialog.artist.name,
          slug: formDialog.artist.slug,
          avatarUrl: formDialog.artist.avatarUrl ?? '',
          role: formDialog.artist.role,
          description: formDialog.artist.description ?? '',
        }
      : {
          name: '',
          slug: '',
          avatarUrl: '',
          role: 'SINGER',
          description: '',
        };

  const deleteDialogOpen = Boolean(deleteDialog);
  const deleteIsBulk = deleteDialog?.type === 'bulk';
  const deleteArtistName = deleteDialog?.artist?.name ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý nghệ sĩ"
        description="Quản lý danh sách ca sĩ, DJ, khách mời và nghệ sĩ tham gia sự kiện."
        actionLabel="Thêm nghệ sĩ"
        actionIcon={<Plus className="size-4" />}
        onAction={() => setFormDialog({ mode: 'create' })}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm nghệ sĩ..."
        onSearchChange={setSearchQuery}
      >
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Vai trò
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái
        </Button>
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} nghệ sĩ`}
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
        <AdminLoadingState rows={6} columns={7} minWidth="min-w-[800px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.artists}
          onAction={() => setFormDialog({ mode: 'create' })}
        />
      ) : (
        <>
          <ArtistTable
            artists={filteredArtists}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleViewArtist}
            onEdit={(artist) => setFormDialog({ mode: 'edit', artist })}
            onDelete={(artist) => setDeleteDialog({ type: 'single', artist })}
          />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredArtists.length}
            pageSize={10}
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
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default Artists;
