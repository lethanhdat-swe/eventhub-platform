import { useState } from 'react';
import { Download } from 'lucide-react';

import { orderService } from '@/lib/services/admin/orderService';

function ExportPdf({ orderId, orderCode, disabled }) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportPdf() {
    if (!orderId || disabled || isExporting) return;

    setIsExporting(true);

    try {
      const blob = await orderService.exportMyOrderTicketPdf(orderId);

      if (!(blob instanceof Blob)) {
        throw new Error('Invalid PDF response.');
      }

      const fileBlob = new Blob([blob], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `eventhub-ticket-${orderCode || orderId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Không thể tải vé PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || isExporting}
      onClick={handleExportPdf}
      className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-(--primary-color)/25 bg-(--primary-color)/10 px-4 py-3 text-sm font-semibold text-(--primary-color) transition hover:border-(--primary-color)/50 hover:bg-(--primary-color)/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="size-4" />
      {isExporting ? 'Đang xuất PDF...' : 'Xuất file PDF'}
    </button>
  );
}

export default ExportPdf;
