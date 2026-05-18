import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/http/apiError';
import { seatService } from '@/lib/services/admin/seatService';
import { ticketTypeService } from '@/lib/services/admin/ticketTypeService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import AddRowDialog from '@/pages/(admin)/DefaultSeats/components/AddRowDialog';
import AddSeatDialog from '@/pages/(admin)/DefaultSeats/components/AddSeatDialog';
import SeatEditDialog from '@/pages/(admin)/DefaultSeats/components/SeatEditDialog';
import SeatMapCard from '@/pages/(admin)/DefaultSeats/components/SeatMapCard';

function DefaultSeats() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [ticketTypeOptions, setTicketTypeOptions] = useState([]);
  const [addSeatOpen, setAddSeatOpen] = useState(false);
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await seatService.listAll();
      setSeats(rows);
    } catch (e) {
      setError(getErrorMessage(e));
      setSeats([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTicketTypes = useCallback(async () => {
    try {
      const payload = await ticketTypeService.list({ page: 1, limit: 100 });
      const rows = payload.data ?? [];
      setTicketTypeOptions(
        rows.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
        }))
      );
    } catch {
      setTicketTypeOptions([]);
    }
  }, []);

  useEffect(() => {
    void loadSeats();
    void loadTicketTypes();
  }, [loadSeats, loadTicketTypes]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleEditOpenChange = (isOpen) => {
    if (!isOpen) setSelectedSeat(null);
  };

  const handleSaveSeat = async (id, body) => {
    setError(null);
    await seatService.update(id, body);
    await loadSeats();
  };

  const handleDeleteSeat = async (id) => {
    setError(null);
    await seatService.deleteMany([id]);
    await loadSeats();
  };

  const handleAddSeat = async (body) => {
    setError(null);
    await seatService.create(body);
    await loadSeats();
  };

  const handleAddRow = async (body) => {
    setError(null);
    await seatService.createRow(body);
    await loadSeats();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quản lý ghế ngồi mặc định"
        description="Thiết lập sơ đồ ghế mặc định và loại vé tương ứng cho từng ghế."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-1.5 rounded-lg px-3.5 text-sm"
              onClick={() => setAddRowOpen(true)}
            >
              <Plus className="size-4 shrink-0" />
              Thêm hàng
            </Button>
            <Button
              type="button"
              className="h-9 gap-1.5 rounded-lg px-3.5 text-sm"
              onClick={() => setAddSeatOpen(true)}
            >
              <Plus className="size-4 shrink-0" />
              Thêm ghế
            </Button>
          </>
        }
      />

      {error && seats.length > 0 ? (
        <div
          className="flex flex-col gap-2 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => void loadSeats()}
          >
            Thử lại
          </Button>
        </div>
      ) : null}

      <SeatMapCard
        seats={seats}
        selectedSeat={selectedSeat}
        isLoading={isLoading}
        error={error}
        onSeatClick={handleSeatClick}
        onRetry={() => void loadSeats()}
      />

      <SeatEditDialog
        open={Boolean(selectedSeat)}
        seat={selectedSeat}
        ticketTypeOptions={ticketTypeOptions}
        onOpenChange={handleEditOpenChange}
        onSave={handleSaveSeat}
        onDelete={handleDeleteSeat}
      />

      <AddSeatDialog
        open={addSeatOpen}
        ticketTypeOptions={ticketTypeOptions}
        onOpenChange={setAddSeatOpen}
        onSave={handleAddSeat}
      />

      <AddRowDialog
        open={addRowOpen}
        ticketTypeOptions={ticketTypeOptions}
        onOpenChange={setAddRowOpen}
        onSave={handleAddRow}
      />
    </div>
  );
}

export default DefaultSeats;
