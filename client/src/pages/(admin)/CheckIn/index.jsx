import { useCallback, useRef, useState } from 'react';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import CheckInResultCard from '@/pages/(admin)/CheckIn/components/CheckInResultCard';
import ManualCheckInForm from '@/pages/(admin)/CheckIn/components/ManualCheckInForm';
import RecentCheckInList from '@/pages/(admin)/CheckIn/components/RecentCheckInList';
import ScanZoneCard from '@/pages/(admin)/CheckIn/components/ScanZoneCard';
import {
  cloneTicketsLookup,
  lookupTicket,
  MOCK_RECENT_CHECKINS,
} from '@/pages/(admin)/CheckIn/data';

const MAX_RECENT_ITEMS = 10;

function createRecentId() {
  return `ci-${crypto.randomUUID().slice(0, 8)}`;
}

function CheckIn() {
  const manualInputRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  const [tickets, setTickets] = useState(cloneTicketsLookup);
  const [recentCheckIns, setRecentCheckIns] = useState(MOCK_RECENT_CHECKINS);
  const [manualCode, setManualCode] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prependRecent = useCallback((entry) => {
    setRecentCheckIns((prev) =>
      [{ ...entry, id: createRecentId() }, ...prev].slice(0, MAX_RECENT_ITEMS)
    );
  }, []);

  const performCheckIn = useCallback(
    (code) => {
      const trimmed = code.trim();
      if (!trimmed) {
        setLastResult({
          type: 'error',
          message: 'Vui lòng nhập mã vé hoặc mã QR.',
          ticket: null,
        });
        return;
      }

      const ticket = lookupTicket(tickets, trimmed);

      if (!ticket) {
        setLastResult({
          type: 'error',
          message: 'Mã không hợp lệ. Không tìm thấy vé tương ứng.',
          ticket: null,
        });
        prependRecent({
          ticketCode: trimmed,
          customerName: '—',
          checkedInAt: new Date().toISOString(),
          success: false,
        });
        return;
      }

      if (ticket.isCheckedIn) {
        setLastResult({
          type: 'error',
          message: 'Vé đã được check-in trước đó.',
          ticket,
        });
        prependRecent({
          ticketCode: ticket.ticketCode,
          customerName: ticket.customerName,
          checkedInAt: ticket.checkedInAt ?? new Date().toISOString(),
          success: false,
        });
        return;
      }

      const checkedInAt = new Date().toISOString();

      setTickets((prev) =>
        prev.map((item) =>
          item.id === ticket.id
            ? { ...item, isCheckedIn: true, checkedInAt }
            : item
        )
      );

      setLastResult({
        type: 'success',
        message: 'Khách đã được xác nhận tham gia sự kiện.',
        ticket: { ...ticket, isCheckedIn: true, checkedInAt },
        checkedInAt,
      });

      prependRecent({
        ticketCode: ticket.ticketCode,
        customerName: ticket.customerName,
        checkedInAt,
        success: true,
      });
    },
    [tickets, prependRecent]
  );

  const handleManualSubmit = () => {
    setIsSubmitting(true);
    performCheckIn(manualCode);
    setIsSubmitting(false);
  };

  const handleStartScan = () => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    setIsScanning(true);
    setLastResult(null);

    scanTimeoutRef.current = setTimeout(() => {
      const nextTicket = tickets.find((ticket) => !ticket.isCheckedIn);
      setIsScanning(false);

      if (nextTicket) {
        performCheckIn(nextTicket.ticketCode);
      } else {
        setLastResult({
          type: 'error',
          message: 'Không còn vé nào chưa check-in trong dữ liệu mẫu.',
          ticket: null,
        });
      }
    }, 500);
  };

  const handleManualEntryFocus = () => {
    manualInputRef.current?.focus();
    manualInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quét mã check-in"
        description="Quét mã QR trên vé để xác nhận khách tham gia sự kiện."
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <ScanZoneCard
            isScanning={isScanning}
            onStartScan={handleStartScan}
            onManualEntry={handleManualEntryFocus}
          />
          <ManualCheckInForm
            ref={manualInputRef}
            code={manualCode}
            onCodeChange={setManualCode}
            onSubmit={handleManualSubmit}
            isSubmitting={isSubmitting}
          />
          <CheckInResultCard result={lastResult} />
        </div>

        <RecentCheckInList items={recentCheckIns} />
      </div>
    </div>
  );
}

export default CheckIn;
