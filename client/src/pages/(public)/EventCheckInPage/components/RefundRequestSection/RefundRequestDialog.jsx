import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/http/apiError';
import { refundService } from '@/lib/services/admin/refundService';
import { isValidEmail, isValidPhone } from '@/utils/formValidation';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrencyIntl } from '@/utils/formatters';

const initialForm = {
    orderCode: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    note: '',
};

function getOrderValue(order, keyList) {
    for (const key of keyList) {
        if (order?.[key]) return order[key];
    }

    return '';
}

function formatCurrency(value) {
    return formatCurrencyIntl(value);
}

function buildInitialForm(order) {
    return {
        orderCode: getOrderValue(order, ['orderCode', 'order_code']),
        customerName: getOrderValue(order, ['customerName', 'customer_name']),
        customerEmail: getOrderValue(order, [
            'customerEmail',
            'customer_email',
        ]),
        customerPhone: getOrderValue(order, [
            'customerPhone',
            'customer_phone',
        ]),
        bankName: '',
        bankAccountNumber: '',
        bankAccountHolder: '',
        note: '',
    };
}

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    required,
    readOnly,
    type = 'text',
    error,
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-(--text-primary)">
                {label}
                {required ? <span className="ml-1 text-red-400">*</span> : null}
            </span>

            <input
                type={type}
                name={name}
                value={value}
                readOnly={readOnly}
                onChange={onChange}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
                className="h-11 w-full rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-3.5 text-sm text-(--text-primary) outline-none transition placeholder:text-(--muted-text) focus:border-(--primary-color) read-only:cursor-not-allowed read-only:opacity-70"
            />
            {error ? (
                <p className="mt-1.5 text-xs text-red-400" role="alert">
                    {error}
                </p>
            ) : null}
        </label>
    );
}

function getRefundErrorMessage(error) {
    const message = getErrorMessage(error);

    const errorMap = {
        'Order not found': 'Không tìm thấy đơn hàng.',
        'Only paid orders can be refunded':
            'Chỉ đơn hàng đã thanh toán mới có thể yêu cầu hoàn vé.',
        'Order information does not match':
            'Thông tin đơn hàng không khớp. Vui lòng kiểm tra lại mã đơn, email và số điện thoại.',
        'Refund request already exists':
            'Đơn hàng này đã có yêu cầu hoàn vé đang chờ xử lý.',
        'Event start date is missing':
            'Không thể kiểm tra thời gian sự kiện để hoàn vé.',
        'Refund is not allowed after the event has started':
            'Sự kiện đã diễn ra hoặc đã đến ngày diễn ra nên không thể hoàn vé.',
    };

    return errorMap[message] || message || 'Gửi yêu cầu hoàn vé thất bại.';
}

function RefundEstimateHint() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-2">
            <Info className="size-3.5 shrink-0 text-(--primary-color)" />
            <p className="min-w-0 flex-1 text-xs leading-5 text-(--muted-text)">
                Để xem tỷ lệ và số tiền hoàn dự kiến, vui lòng đăng nhập và mở
                trang chi tiết vé từ Vé của tôi.
            </p>
            <Link
                to={isAuthenticated ? '/my-tickets' : '/login'}
                className="shrink-0 rounded-full bg-(--primary-color)/15 px-2.5 py-1 text-xs font-medium text-(--primary-color) transition hover:bg-(--primary-color)/25"
            >
                {isAuthenticated ? 'Vé của tôi' : 'Đăng nhập'}
            </Link>
        </div>
    );
}

function RefundRequestDialog({
    open,
    onOpenChange,
    order,
    expectedRefundPercent,
    onSuccess,
}) {
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const hasOrder = Boolean(order);

    useEffect(() => {
        if (open) {
            setForm(buildInitialForm(order));
            setFieldErrors({});
        }
    }, [open, order]);

    useEffect(() => {
        if (!open) return undefined;

        function handleKeyDown(event) {
            if (event.key === 'Escape' && !submitting) {
                onOpenChange?.(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, submitting, onOpenChange]);

    const totalAmount = Number(order?.totalAmount || order?.total_amount || 0);

    const expectedRefundAmount = useMemo(() => {
        if (!expectedRefundPercent) return 0;
        return totalAmount * (expectedRefundPercent / 100);
    }, [expectedRefundPercent, totalAmount]);

    if (!open) return null;

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }

    function validateForm() {
        const errors = {};
        const requiredFields = [
            ['orderCode', 'Mã đơn hàng'],
            ['customerName', 'Họ tên'],
            ['customerEmail', 'Email'],
            ['customerPhone', 'Số điện thoại'],
            ['bankName', 'Tên ngân hàng'],
            ['bankAccountNumber', 'Số tài khoản'],
            ['bankAccountHolder', 'Tên chủ tài khoản'],
        ];

        for (const [key, label] of requiredFields) {
            if (!String(form[key] || '').trim()) {
                errors[key] = `${label} không được để trống.`;
            }
        }

        if (!errors.customerEmail && !isValidEmail(form.customerEmail)) {
            errors.customerEmail = 'Email không hợp lệ.';
        }

        if (!errors.customerPhone && !isValidPhone(form.customerPhone)) {
            errors.customerPhone = 'Số điện thoại cần 10–11 chữ số.';
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setFieldErrors({});
        setSubmitting(true);

        try {
            const payload = {
                orderCode: form.orderCode.trim(),
                customerName: form.customerName.trim(),
                customerEmail: form.customerEmail.trim(),
                customerPhone: form.customerPhone.trim(),
                bankName: form.bankName.trim(),
                bankAccountNumber: form.bankAccountNumber.trim(),
                bankAccountHolder: form.bankAccountHolder.trim(),
                note: form.note.trim() || undefined,
            };

            const result = await refundService.create(payload);
            const refundAmount = result?.refundAmount || expectedRefundAmount;

            toast.success(
                refundAmount
                    ? `Đã gửi yêu cầu hoàn vé. Số tiền dự kiến: ${formatCurrency(refundAmount)}`
                    : 'Đã gửi yêu cầu hoàn vé.'
            );

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error(getRefundErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        if (submitting) return;
        onOpenChange?.(false);
    }

    return createPortal(
        <div className="pointer-events-auto fixed inset-0 z-[10050] flex items-center justify-center px-4 py-6">
            <button
                type="button"
                aria-label="Đóng"
                className="absolute inset-0 bg-black/60"
                onClick={handleClose}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="refund-request-dialog-title"
                className="relative z-10 flex max-h-[88vh] w-full max-w-225 flex-col overflow-hidden rounded-2xl border border-(--border-color) bg-(--surface-color) shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-(--border-color) px-5 py-4">
                    <div>
                        <h3
                            id="refund-request-dialog-title"
                            className="text-xl font-semibold text-(--text-primary)"
                        >
                            Yêu cầu hoàn vé
                        </h3>
                        <p className="mt-1.5 text-sm leading-5 text-(--muted-text)">
                            Nhập thông tin đơn hàng và tài khoản ngân hàng để
                            quản trị viên xử lý hoàn tiền.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={submitting}
                        onClick={handleClose}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-(--muted-text) transition hover:bg-(--soft-surface-color) hover:text-(--text-primary) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 min-h-0 overflow-y-auto"
                >
                    <div className="px-5 py-5 space-y-5">
                        {hasOrder ? (
                            <div className="grid gap-3 rounded-xl border border-(--border-color) bg-(--soft-surface-color) p-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-(--muted-text)">
                                        Tỷ lệ hoàn
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-(--text-primary)">
                                        {expectedRefundPercent || 0}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-(--muted-text)">
                                        Tổng đơn
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-(--text-primary)">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-(--muted-text)">
                                        Dự kiến hoàn
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-(--primary-color)">
                                        {formatCurrency(expectedRefundAmount)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <RefundEstimateHint />
                        )}

                        <div>
                            <h4 className="mb-3 text-sm font-semibold text-(--text-primary)">
                                Thông tin đơn hàng
                            </h4>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Mã đơn hàng"
                                    name="orderCode"
                                    value={form.orderCode}
                                    onChange={handleChange}
                                    placeholder="Nhập mã đơn hàng"
                                    required
                                    readOnly={hasOrder}
                                    error={fieldErrors.orderCode}
                                />

                                <Field
                                    label="Họ tên"
                                    name="customerName"
                                    value={form.customerName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ tên"
                                    required
                                    error={fieldErrors.customerName}
                                />

                                <Field
                                    label="Email đặt vé"
                                    name="customerEmail"
                                    type="email"
                                    value={form.customerEmail}
                                    onChange={handleChange}
                                    placeholder="email@vidu.com"
                                    required
                                    error={fieldErrors.customerEmail}
                                />

                                <Field
                                    label="Số điện thoại đặt vé"
                                    name="customerPhone"
                                    value={form.customerPhone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                    required
                                    error={fieldErrors.customerPhone}
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-3 text-sm font-semibold text-(--text-primary)">
                                Thông tin nhận tiền
                            </h4>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Tên ngân hàng"
                                    name="bankName"
                                    value={form.bankName}
                                    onChange={handleChange}
                                    placeholder="VD: Vietcombank"
                                    required
                                    error={fieldErrors.bankName}
                                />

                                <Field
                                    label="Số tài khoản"
                                    name="bankAccountNumber"
                                    value={form.bankAccountNumber}
                                    onChange={handleChange}
                                    placeholder="Nhập số tài khoản"
                                    required
                                    error={fieldErrors.bankAccountNumber}
                                />

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Tên chủ tài khoản"
                                        name="bankAccountHolder"
                                        value={form.bankAccountHolder}
                                        onChange={handleChange}
                                        placeholder="VD: NGUYEN VAN A"
                                        required
                                        error={fieldErrors.bankAccountHolder}
                                    />
                                </div>

                                <label className="block sm:col-span-2">
                                    <span className="mb-2 block text-sm font-medium text-(--text-primary)">
                                        Ghi chú
                                    </span>

                                    <textarea
                                        name="note"
                                        value={form.note}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Nhập ghi chú nếu có..."
                                        className="w-full resize-none rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-3.5 py-3 text-sm text-(--text-primary) outline-none transition placeholder:text-(--muted-text) focus:border-(--primary-color)"
                                    />
                                </label>
                            </div>
                        </div>

                        <p className="rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-3 text-sm leading-5 text-(--muted-text)">
                            Yêu cầu hoàn vé sẽ được đưa vào hàng chờ. Quản trị
                            viên sẽ kiểm tra và chuyển khoản thủ công theo chính
                            sách hoàn vé.
                        </p>
                    </div>

                    <div className="sticky bottom-0 flex justify-end gap-3 border-t border-(--border-color) bg-(--surface-color) px-5 py-4">
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={handleClose}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-(--border-color) bg-transparent px-5 text-sm font-medium text-(--text-primary) transition hover:bg-(--soft-surface-color) disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-color) px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : null}
                            Gửi yêu cầu
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default RefundRequestDialog;
