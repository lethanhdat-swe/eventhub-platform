import { XCircle } from 'lucide-react';

function PaymentError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <XCircle size={80} className="text-red-500" />
      <h2 className="text-2xl font-bold text-red-600">Thanh toán thất bại!</h2>
      <p className="text-gray-500">Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Thử lại
      </button>
    </div>
  );
}

export default PaymentError;