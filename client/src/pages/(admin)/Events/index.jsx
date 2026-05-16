import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import AdminFilterDropdown from '@/pages/(admin)/components/AdminFilterDropdown';
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
import {
  EVENT_STATUS_OPTIONS,
  filterEvents,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
} from '@/pages/(admin)/Events/data';

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [deleteDialog, setDeleteDialog] = useState(null);

  const eventStatusFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...EVENT_STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: o.label,
      })),
    ],
    []
  );

  const eventCategoryFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...MOCK_CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
    ],
    []
  );

  const filteredEvents = useMemo(
    () =>
      filterEvents(events, searchQuery, {
        status: statusFilter,
        categoryId: categoryFilter,
      }),
    [events, searchQuery, statusFilter, categoryFilter]
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

  const handleView = (event) => {
    navigate(`/admin/events/${event.id}`);
  };

  const handleEdit = (event) => {
    navigate(`/admin/events/${event.id}/edit`);
  };

  const handleToggleStatus = (event) => {
    const nextStatus =
      event.status === 'active' ? 'draft' : 'active';
    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDelete = (event) => {
    setDeleteDialog({ type: 'single', event });
  };

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
        <AdminFilterDropdown
          label="Trạng thái"
          options={eventStatusFilterOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <AdminFilterDropdown
          label="Danh mục"
          options={eventCategoryFilterOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
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
            onView={handleView}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
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
