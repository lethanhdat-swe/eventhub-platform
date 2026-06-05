import { useRef, useState } from 'react';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import { useRecentCheckIns } from '@/hooks/useRecentCheckIns';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useQrScanner } from '@/hooks/useQrScanner';
import ScanZoneCard from './components/ScanZoneCard/ScanZoneCard';
import ManualCheckInForm from './components/ManualCheckInForm/ManualCheckInForm';
import CheckInResultCard from './components/CheckInResultCard/CheckInResultCard';
import RecentCheckInList from './components/RecentCheckInList/RecentCheckInList';
import ResultDialog from './components/ResultDialog/ResultDialog';

const QR_READER_ID = 'qr-reader';

function CheckIn() {
  const manualInputRef = useRef(null);

  const [manualCode, setManualCode] =
    useState('');

  const {
    items: recentLogs,
    error: historyError,
    isLoading: isRecentLoading,
    reload: reloadRecentLogs,
  } = useRecentCheckIns();

  const {
    isSubmitting,
    lastResult,
    notice,
    setNotice,
    scanToken,
  } = useCheckIn(reloadRecentLogs);

  const {
    isScanning,
    scanError,
    startScanner,
    stopScanner,
  } = useQrScanner({
    scannerElementId: QR_READER_ID,
    onDecoded: scanToken,
  });

  const handleManualSubmit = () => {
    void scanToken(manualCode);

    setManualCode('');
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
            onStopScan={() => void stopScanner()}
            onManualEntry={
              handleManualEntryFocus
            }
          />

          <ManualCheckInForm
            ref={manualInputRef}
            code={manualCode}
            onCodeChange={setManualCode}
            onSubmit={handleManualSubmit}
            isSubmitting={isSubmitting}
          />

          <CheckInResultCard
            result={lastResult}
          />
        </div>

        <RecentCheckInList
          items={recentLogs}
          isLoading={isRecentLoading}
          error={historyError}
        />
      </div>

      <ResultDialog
        notice={notice}
        onOpenChange={(open) => {
          if (!open) {
            setNotice(null);
          }
        }}
      />
    </div>
  );
}

export default CheckIn;