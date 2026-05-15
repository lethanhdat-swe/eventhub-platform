import { QrCode, ScanLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

function ScanZoneCard({
  isScanning,
  onStartScan,
  onManualEntry,
  className,
}) {
  return (
    <Card className={cn('gap-0 py-0', className)}>
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle className="text-base">Khu vực quét</CardTitle>
        <CardDescription>
          Đưa mã QR trên vé vào khung hình camera để check-in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center px-4 py-8 text-center">
        <div
          className={cn(
            'mb-4 flex size-24 items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30',
            isScanning
              ? 'border-primary/50 bg-primary/5'
              : 'border-border'
          )}
        >
          {isScanning ? (
            <ScanLine className="size-10 animate-pulse text-primary" />
          ) : (
            <QrCode className="size-10 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium">
          {isScanning ? 'Đang quét mã QR...' : 'Sẵn sàng quét mã QR'}
        </p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          {isScanning
            ? 'Giữ mã QR trong khung hình cho đến khi có kết quả.'
            : 'Nhấn bắt đầu để mô phỏng quét vé chưa check-in.'}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            className="h-9 cursor-pointer"
            disabled={isScanning}
            onClick={onStartScan}
          >
            {isScanning ? 'Đang quét...' : 'Bắt đầu quét'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 cursor-pointer"
            onClick={onManualEntry}
          >
            Nhập mã thủ công
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScanZoneCard;
