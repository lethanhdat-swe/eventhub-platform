import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { categoryService } from '@/lib/services/admin/categoryService';
import { eventService } from '@/lib/services/admin/eventService';
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
  mapEventRow,
} from '@/pages/(admin)/Events/data';

const PAGE_SIZE = 10;

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

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
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ],
    [categories]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter]);

  const loadCategories = useCallback(async () => {
    try {
      const payload = await categoryService.list({ page: 1, limit: 100 });
      setCategories(payload.data ?? []);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await eventService.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        status: statusFilter,
        categoryId: categoryFilter,
      });
      const rows = payload.data ?? [];
      setEvents(rows.map(mapEventRow));
      const m = payload.meta ?? {};
      setMeta({
        totalItems: m.totalItems ?? 0,
        totalPages: Math.max(1, m.totalPages ?? 1),
        currentPage: m.currentPage ?? page,
        itemsPerPage: m.itemsPerPage ?? PAGE_SIZE,
      });
    } catch (e) {
      setError(getErrorMessage(e));
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(events.map((event) => event.id)));
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

  const handleDeleteConfirm = async () => {
    if (!deleteDialog || deleteSubmitting) return;

    setDeleteSubmitting(true);
    setError(null);
    try {
      if (deleteDialog.type === 'bulk') {
        await eventService.deleteMany([...selectedIds]);
        setSelectedIds(new Set());
      } else {
        await eventService.deleteMany([deleteDialog.event.id]);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteDialog.event.id);
          return next;
        });
      }
      setDeleteDialog(null);
      await loadEvents();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setDeleteSubmitting(false);
    }
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

  const handleDelete = (event) => {
    setDeleteDialog({ type: 'single', event });
  };

  const isEmpty = !isLoading && events.length === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quản lý sự kiện"
        description="Quản lý danh sách sự kiện, trạng thái hiển thị và thông tin tổ chức."
        actionLabel="Tạo sự kiện"
        actionIcon={<Plus className="size-4" />}
        onAction={() => navigate('/admin/events/create')}
      />

      {error && events.length > 0 ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 cursor-pointer"
            onClick={() => void loadEvents()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <AdminToolbar
        searchPlaceholder="Tìm kiếm sự kiện..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
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
          {...(error
            ? {
                title: 'Không tải được danh sách',
                description: error,
                actionLabel: 'Thử lại',
                onAction: () => void loadEvents(),
              }
            : {
                ...ADMIN_EMPTY_STATES.events,
                onAction: () => navigate('/admin/events/create'),
              })}
        />
      ) : (
        <>
          <EventTable
            events={events}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={handleView}
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

      <DeleteEventDialog
        open={Boolean(deleteDialog)}
        eventTitle={deleteDialogTitle}
        isDeleting={deleteSubmitting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => {
          if (!deleteSubmitting) setDeleteDialog(null);
        }}
      />
    </div>
  );
}

export default AdminEvents;
