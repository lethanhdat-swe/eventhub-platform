import { XCircle } from 'lucide-react';

function PaymentError() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-100">
      <XCircle size={80} className="text-red-500" />
      <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại!</h2>
      <p className="text-gray-500">Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-2 mt-4 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
      >
        Thử lại
      </button>
    </div>
  );
}

export default PaymentError;