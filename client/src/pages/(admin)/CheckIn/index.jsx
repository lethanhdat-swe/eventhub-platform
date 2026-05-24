import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parseApiError } from '@/lib/http/apiError';
import { checkInLogService } from '@/lib/services/admin/checkInLogService';
import PageHeader from '@/pages/(admin)/components/PageHeader';
import CheckInResultCard from '@/pages/(admin)/CheckIn/components/CheckInResultCard';
import ManualCheckInForm from '@/pages/(admin)/CheckIn/components/ManualCheckInForm';
import RecentCheckInList from '@/pages/(admin)/CheckIn/components/RecentCheckInList';
import ScanZoneCard from '@/pages/(admin)/CheckIn/components/ScanZoneCard';
import { CHECKIN_LOG_STATUS_LABELS } from '@/pages/(admin)/CheckIn/data';

const RECENT_LOG_LIMIT = 5;
const QR_READER_ID = 'qr-reader';

function normalizeScanResult(data, token) {
  return {
    ...data,
    token: data?.token ?? token,
    status: data?.status ?? 'VALID',
    message: data?.message ?? 'Check-in thành công.',
    scannedAt: data?.scannedAt ?? data?.checkedInAt ?? new Date().toISOString(),
    ticketId: data?.ticketId ?? data?.id ?? null,
    eventTitle: data?.eventTitle ?? data?.event?.title ?? null,
    seatLabel: data?.seatLabel ?? null,
    ticketType: data?.ticketType ?? null,
  };
}

function createErrorResult({ token, status, message }) {
  return {
    token,
    status,
    message,
    scannedAt: new Date().toISOString(),
    ticketId: null,
    orderCode: null,
    customerName: null,
    customerEmail: null,
    eventTitle: null,
    seatLabel: null,
    ticketType: null,
  };
}

function getStatusFromErrorCode(code) {
  if (code === 409) return 'DUPLICATE';
  if (code === 400 || code === 404) return 'INVALID';
  return 'INVALID';
}

function ResultDialog({ notice, onOpenChange }) {
  const isSuccess = notice?.status === 'VALID';

  return (
    <Dialog open={Boolean(notice)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-5 text-destructive" />
            )}
            <DialogTitle>
              {isSuccess
                ? 'Check-in hợp lệ'
                : notice?.status === 'DUPLICATE'
                  ? 'Quét trùng'
                  : 'Token không hợp lệ'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {notice?.message || 'Đã xử lý lượt quét QR.'}
          </DialogDescription>
        </DialogHeader>
        {notice ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Trạng thái: </span>
            <span className="font-medium">
              {CHECKIN_LOG_STATUS_LABELS[notice.status] ?? notice.status}
            </span>
          </div>
        ) : null}
        <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Đã hiểu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CheckIn() {
  const manualInputRef = useRef(null);
  const scannerRef = useRef(null);
  const isHandlingScanRef = useRef(false);

  const [recentLogs, setRecentLogs] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [notice, setNotice] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [isRecentLoading, setIsRecentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const loadRecentLogs = useCallback(async () => {
    setIsRecentLoading(true);
    setHistoryError(null);

    try {
      const payload = await checkInLogService.history({
        page: 1,
        limit: RECENT_LOG_LIMIT,
      });
      setRecentLogs(payload.data ?? []);
    } catch (error) {
      setHistoryError(parseApiError(error).message);
      setRecentLogs([]);
    } finally {
      setIsRecentLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecentLogs();
  }, [loadRecentLogs]);

  const stopScanner = useCallback(async ({ resetHandling = true } = {}) => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setIsScanning(false);
      if (resetHandling) isHandlingScanRef.current = false;
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Ignore stop failures so cleanup can still clear the camera UI.
    } finally {
      try {
        scanner.clear();
      } catch {
        // html5-qrcode can throw if clear runs before start completes.
      }

      scannerRef.current = null;
      setIsScanning(false);
      if (resetHandling) isHandlingScanRef.current = false;
    }
  }, []);

  const handleScanToken = useCallback(
    async (rawToken, { clearManualCode = false } = {}) => {
      const token = rawToken.trim();
      console.log(token);

      if (!token) {
        const result = createErrorResult({
          token: '',
          status: 'INVALID',
          message: 'Vui lòng nhập token QR để kiểm tra.',
        });
        setLastResult(result);
        setNotice(result);
        return;
      }

      setIsSubmitting(true);

      try {
        const data = await checkInLogService.scan({ token });
        const result = normalizeScanResult(data, token);
        setLastResult(result);
        setNotice(result);
        if (clearManualCode) setManualCode('');
      } catch (error) {
        const apiError = parseApiError(error);
        const result = createErrorResult({
          token,
          status: getStatusFromErrorCode(apiError.status),
          message: apiError.message || 'Mã QR không hợp lệ.',
        });
        setLastResult(result);
        setNotice(result);
      } finally {
        await loadRecentLogs();
        setIsSubmitting(false);
        isHandlingScanRef.current = false;
      }
    },
    [loadRecentLogs]
  );

  const handleCameraDecoded = useCallback(
    async (decodedText) => {
      if (isHandlingScanRef.current) return;

      isHandlingScanRef.current = true;
      await stopScanner({ resetHandling: false });
      await handleScanToken(decodedText);
    },
    [handleScanToken, stopScanner]
  );

  const startScanner = useCallback(() => {
    if (scannerRef.current || isScanning) return;

    isHandlingScanRef.current = false;
    setScanError(null);
    setIsScanning(true);
  }, [isScanning]);

  const handleManualSubmit = () => {
    void handleScanToken(manualCode, { clearManualCode: true });
  };

  useEffect(() => {
    if (!isScanning || scannerRef.current) return undefined;

    let isCancelled = false;
    const timerId = window.setTimeout(async () => {
      if (isCancelled || scannerRef.current) return;

      const scannerElement = document.getElementById(QR_READER_ID);
      if (!scannerElement) {
        setScanError('Không tìm thấy khu vực hiển thị camera.');
        setIsScanning(false);
        return;
      }

      const scanner = new Html5Qrcode(QR_READER_ID);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          handleCameraDecoded,
          () => {}
        );

        if (isCancelled) {
          try {
            if (scanner.isScanning) await scanner.stop();
            scanner.clear();
          } catch {
            // Component is already leaving; best effort camera cleanup.
          }
          scannerRef.current = null;
        }
      } catch {
        try {
          scanner.clear();
        } catch {
          // Nothing to clear if browser blocked camera before start.
        }

        scannerRef.current = null;
        if (!isCancelled) {
          setScanError(
            'Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.'
          );
          setIsScanning(false);
        }
      }
    }, 100);

    return () => {
      isCancelled = true;
      window.clearTimeout(timerId);
    };
  }, [handleCameraDecoded, isScanning]);

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      isHandlingScanRef.current = false;

      if (!scanner) return;

      const clearScanner = () => {
        try {
          scanner.clear();
        } catch {
          // Ignore cleanup errors while navigating away.
        }
      };

      if (scanner.isScanning) {
        scanner.stop().then(clearScanner).catch(clearScanner);
        return;
      }

      clearScanner();
    };
  }, []);

  const handleStopScanner = () => {
    void stopScanner();
  };

  const handleManualEntryFocus = () => {
    manualInputRef.current?.focus();
    manualInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quét mã check-in"
        description="Quét mã QR trên vé để ghi nhận lượt quét tại cổng vào."
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <ScanZoneCard
            isScanning={isScanning}
            isStartDisabled={isSubmitting}
            scannerElementId={QR_READER_ID}
            scanError={scanError}
            onStartScan={startScanner}
            onStopScan={handleStopScanner}
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

        <RecentCheckInList
          items={recentLogs}
          isLoading={isRecentLoading}
          error={historyError}
        />
      </div>
      <ResultDialog
        notice={notice}
        onOpenChange={(open) => !open && setNotice(null)}
      />
    </div>
  );
}

export default CheckIn;
