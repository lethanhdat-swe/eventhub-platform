import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { eventService } from '@/lib/services/admin/eventService';
import { ticketTypeService } from '@/lib/services/admin/ticketTypeService';
import EventSeatMap from './EventSeatMap';
import AddRowDialog from './AddRowDialog';
import AddSeatDialog from './AddSeatDialog';
import EditSeatDialog from './EditSeatDialog';
import BulkActions from './BulkActions';
import TicketTypeLegend from './TicketTypeLegend';

export default function EventSeats({ eventId }) {
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [addSeatOpen, setAddSeatOpen] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);

  const loadSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await eventService.getSeats(eventId, {
        page: 1,
        limit: 500,
      });
      const rows = payload.data ?? [];
      // sort by rowLabel asc then seatNumber asc
      rows.sort((a, b) => {
        if (a.rowLabel === b.rowLabel)
          return (a.seatNumber ?? 0) - (b.seatNumber ?? 0);
        return a.rowLabel < b.rowLabel ? -1 : 1;
      });
      setSeats(rows);
    } catch (e) {
      setError(getErrorMessage(e));
      setSeats([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const loadTicketTypes = useCallback(async () => {
    try {
      const payload = await ticketTypeService.list({ page: 1, limit: 100 });
      setTicketTypes(payload.data ?? []);
    } catch {
      setTicketTypes([]);
    }
  }, []);

  useEffect(() => {
    void loadSeats();
    void loadTicketTypes();
  }, [loadSeats, loadTicketTypes]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const handleToggleSelectMode = () => {
    setSelectMode((prev) => {
      if (prev) {
        clearSelection();
      }
      return !prev;
    });
  };

  const handleSeatClick = (seat) => {
    if (selectMode) {
      toggleSelect(seat.id);
      return;
    }

    setEditingSeat(seat);
    setEditOpen(true);
  };

  const handleBulkDelete = async (ids) => {
    setError(null);
    try {
      await eventService.deleteSeats(eventId, ids);
      clearSelection();
      await loadSeats();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const handleAddRow = async (data) => {
    // data: { rowLabel, fromSeatNumber, toSeatNumber, ticketTypeId }
    setError(null);
    try {
      const ops = [];
      const from = Number(data.fromSeatNumber ?? 1);
      const to = Number(data.toSeatNumber ?? from);
      for (let n = from; n <= to; n++) {
        ops.push(
          eventService.createSeat(eventId, {
            rowLabel: data.rowLabel,
            seatNumber: n,
            ticketTypeId: data.ticketTypeId || null,
            status: 'AVAILABLE',
          })
        );
      }
      await Promise.all(ops);
      setAddRowOpen(false);
      await loadSeats();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const handleAddSeat = async (data) => {
    setError(null);
    try {
      await eventService.createSeat(eventId, {
        rowLabel: data.rowLabel,
        seatNumber: Number(data.seatNumber),
        ticketTypeId: data.ticketTypeId || null,
        status: data.status || 'AVAILABLE',
      });
      setAddSeatOpen(false);
      await loadSeats();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const ticketTypeMap = useMemo(() => {
    const m = new Map();
    ticketTypes.forEach((t) => m.set(t.id, t));
    return m;
  }, [ticketTypes]);

  const handleSaveSeatEdit = async (data) => {
    setError(null);

    try {
      await eventService.updateSeat(eventId, data.id, {
        status: data.status,
        ticketTypeId: data.ticketTypeId,
      });

      setEditOpen(false);
      setEditingSeat(null);
      await loadSeats();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <EventSeatMap
            seats={seats}
            ticketTypeMap={ticketTypeMap}
            selectedIds={selectedIds}
            selectMode={selectMode}
            onSeatClick={handleSeatClick}
            isLoading={isLoading}
          />
        </div>

        <div className="w-48 hidden md:block">
          <TicketTypeLegend ticketTypes={ticketTypes} />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={selectMode ? 'secondary' : 'outline'}
            size="sm"
            className="h-10 px-4"
            onClick={handleToggleSelectMode}
          >
            {selectMode ? 'Tắt chế độ chọn' : 'Bật chế độ chọn'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4"
            onClick={() => setAddRowOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm hàng
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4"
            onClick={() => setAddSeatOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm ghế
          </Button>
        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : null}
        </div>
      </div>

      {selectMode ? (
        <BulkActions
          selectedIds={selectedIds}
          onClearSelection={clearSelection}
          onDelete={handleBulkDelete}
        />
      ) : null}

      <AddRowDialog
        open={addRowOpen}
        onOpenChange={setAddRowOpen}
        ticketTypes={ticketTypes}
        onSave={handleAddRow}
      />
      <AddSeatDialog
        open={addSeatOpen}
        onOpenChange={setAddSeatOpen}
        ticketTypes={ticketTypes}
        onSave={handleAddSeat}
      />
      <EditSeatDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        seat={editingSeat}
        ticketTypes={ticketTypes}
        onSave={handleSaveSeatEdit}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
