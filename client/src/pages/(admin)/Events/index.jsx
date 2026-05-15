import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import DeleteEventDialog from '@/pages/(admin)/Events/components/DeleteEventDialog';
import EventTable from '@/pages/(admin)/Events/components/EventTable';
import { filterEvents, MOCK_EVENTS } from '@/pages/(admin)/Events/data';

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);

  const filteredEvents = useMemo(
    () => filterEvents(events, searchQuery),
    [events, searchQuery]
  );

  const isLoading = false;
  const isEmpty = !isLoading && filteredEvents.length === 0;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredEvents.map((event) => event.id)));
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

  const handleDeleteConfirm = () => {
    if (!deleteDialog) return;

    if (deleteDialog.type === 'bulk') {
      setEvents((prev) => prev.filter((event) => !selectedIds.has(event.id)));
      setSelectedIds(new Set());
      setDeleteDialog(null);
      return;
    }

    setEvents((prev) =>
      prev.filter((event) => event.id !== deleteDialog.event.id)
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteDialog.event.id);
      return next;
    });
    setDeleteDialog(null);
  };

  const deleteDialogTitle =
    deleteDialog?.type === 'bulk'
      ? `${selectedIds.size} sự kiện đã chọn`
      : deleteDialog?.event?.title ?? '';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý sự kiện"
        description="Quản lý danh sách sự kiện, trạng thái hiển thị và thông tin tổ chức."
        actionLabel="Tạo sự kiện"
        actionIcon={<Plus className="size-4" />}
        onAction={() => navigate('/admin/events/create')}
      />

      <AdminToolbar
        searchPlaceholder="Tìm kiếm sự kiện..."
        onSearchChange={setSearchQuery}
      >
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Trạng thái
        </Button>
        <Button type="button" variant="outline" className="h-9 px-3 text-sm">
          Danh mục
        </Button>
      </AdminToolbar>

      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} sự kiện`}
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
        <AdminLoadingState rows={6} columns={8} minWidth="min-w-[960px]" />
      ) : isEmpty ? (
        <AdminEmptyState
          {...ADMIN_EMPTY_STATES.events}
          onAction={() => navigate('/admin/events/create')}
        />
      ) : (
        <>
          <EventTable
            events={filteredEvents}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={(id) => navigate(`/admin/events/${id}`)}
            onEdit={(id) => navigate(`/admin/events/${id}/edit`)}
            onDelete={(event) => setDeleteDialog({ type: 'single', event })}
          />
          <AdminPagination
            currentPage={1}
            totalPages={1}
            totalItems={filteredEvents.length}
            pageSize={10}
          />
        </>
      )}

      <DeleteEventDialog
        open={Boolean(deleteDialog)}
        eventTitle={deleteDialogTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </div>
  );
}

export default AdminEvents;
