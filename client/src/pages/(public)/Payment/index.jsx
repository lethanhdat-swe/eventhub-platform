import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getErrorMessage } from '@/lib/http/apiError';
import { couponService, orderService } from '@/lib/services/admin';
import { useAuthStore } from '@/stores/authStore';

import BankTransferMethod from './components/BankTransferMethod/BankTransferMethod';
import ContactInformationSection from './components/ContactInformationSection/ContactInformationSection';
import OrderSummarySection from './components/OrderSummarySection/OrderSummarySection';
import PaymentActionSection from './components/PaymentActionSection/PaymentActionSection';
import PaymentHero from './components/PaymentHero/PaymentHero';
import PaymentMethodSection from './components/PaymentMethodSection/PaymentMethodSection';
import { validateCustomerInfo } from '@/utils/formValidation';
import {
    canBookEvent,
    isEventEnded,
    isEventOngoing,
} from '@/utils/eventDate';

const EMPTY_SELECTED_SEATS = [];

function getSeatLabel(seat) {
    return `${seat.seat?.rowLabel ?? ''}${seat.seat?.seatNumber ?? ''}`;
}

function getCustomerInfo(stateCustomerInfo, authUser) {
    return {
        name:
            stateCustomerInfo?.name ||
            authUser?.fullName ||
            authUser?.name ||
            '',
        email: stateCustomerInfo?.email || authUser?.email || '',
        phone:
            stateCustomerInfo?.phone ||
            authUser?.phoneNumber ||
            authUser?.phone ||
            '',
    };
}

function groupTicketItems(selectedSeats) {
    const map = new Map();

    selectedSeats.forEach((seat) => {
        const ticketName = seat.ticketType?.name ?? 'Vé';
        const ticketColor = seat.ticketType?.color ?? 'var(--primary-color)';
        const price = Number(seat.ticketType?.price ?? 0);
        const key = `${ticketName}-${price}`;

        const current = map.get(key) ?? {
            ticketType: ticketName,
            color: ticketColor,
            quantity: 0,
            seats: [],
            price,
            total: 0,
        };

        current.quantity += 1;
        current.seats.push(getSeatLabel(seat));
        current.total += price;

        map.set(key, current);
    });

    return Array.from(map.values());
}

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const authUser = useAuthStore((state) => state.user);
    const checkoutState = location.state ?? {};
    const event = checkoutState.event ?? null;
    const selectedSeats = checkoutState.selectedSeats ?? EMPTY_SELECTED_SEATS;
    const selectedSeatIds =
        checkoutState.selectedSeatIds ?? selectedSeats.map((seat) => seat.id);
    const customerInfo = getCustomerInfo(checkoutState.customerInfo, authUser);
    const [couponCode, setCouponCode] = useState('');
    const latestCouponCodeRef = useRef('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [createdOrder, setCreatedOrder] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);

    const ticketItems = useMemo(
        () => groupTicketItems(selectedSeats),
        [selectedSeats]
    );
    const subtotal = useMemo(
        () =>
            selectedSeats.reduce(
                (sum, seat) => sum + Number(seat.ticketType?.price ?? 0),
                0
            ),
        [selectedSeats]
    );
    const previewDiscountAmount = Number(appliedCoupon?.discountAmount ?? 0);
    const previewTotalAmount = Math.max(
        Number(appliedCoupon?.finalAmount ?? subtotal),
        0
    );
    const totalFromOrder = Number(
        createdOrder?.totalAmount ?? previewTotalAmount
    );
    const discountAmount = createdOrder
        ? Math.max(subtotal - totalFromOrder, 0)
        : previewDiscountAmount;
    const isEnded = isEventEnded(event);
    const isOngoing = isEventOngoing(event);
    const canBook = canBookEvent(event);
    const canSubmit =
        selectedSeatIds.length > 0 && !createdOrder && canBook;
    const backTo = event?.id ? `/booking?eventId=${event.id}` : '/booking';

    const handleCouponCodeChange = (value) => {
        setCouponCode(value);
        latestCouponCodeRef.current = value;
        setAppliedCoupon(null);
        setCouponError('');
        setCouponSuccess('');
    };

    const handleApplyCoupon = async () => {
        const trimmedCouponCode = couponCode.trim();
        if (!trimmedCouponCode || isApplyingCoupon) return;

        setIsApplyingCoupon(true);
        setAppliedCoupon(null);
        setCouponError('');
        setCouponSuccess('');

        try {
            const verifiedCoupon = await couponService.verify({
                code: trimmedCouponCode,
                orderAmount: subtotal,
            });

            if (latestCouponCodeRef.current.trim() !== trimmedCouponCode)
                return;

            setAppliedCoupon(verifiedCoupon);
            latestCouponCodeRef.current =
                verifiedCoupon.code ?? trimmedCouponCode.toUpperCase();
            setCouponCode(
                verifiedCoupon.code ?? trimmedCouponCode.toUpperCase()
            );
            setCouponSuccess('Áp dụng mã giảm giá thành công.');
        } catch (error) {
            if (latestCouponCodeRef.current.trim() !== trimmedCouponCode)
                return;

            setAppliedCoupon(null);
            setCouponError(getErrorMessage(error));
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleSubmitOrder = async () => {
        if (isEnded) {
            setSubmitError(
                'Sự kiện này đã kết thúc. Bạn không thể đặt vé mới.'
            );
            return;
        }

        if (isOngoing) {
            setSubmitError(
                'Sự kiện đang diễn ra. Bạn không thể đặt vé mới.'
            );
            return;
        }

        if (selectedSeatIds.length === 0) {
            setSubmitError(
                'Vui lòng chọn ít nhất một ghế trước khi thanh toán.'
            );
            return;
        }

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            setSubmitError(
                'Vui lòng cập nhật đầy đủ họ tên, email và số điện thoại.'
            );
            return;
        }

        const customerErrors = validateCustomerInfo({
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
        });
        const customerErrorMessages = Object.values(customerErrors);
        if (customerErrorMessages.length > 0) {
            setSubmitError(customerErrorMessages.join(' '));
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await orderService.create({
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone,
                eventSeatIds: selectedSeatIds,
                couponCode: appliedCoupon?.code || undefined,
            });

            const order = response.order ?? response;
            const sepay = response.sepay ?? response.payment ?? null;

            setCreatedOrder(order);
            setPaymentInfo(sepay);
            sessionStorage.setItem(
                'eventhub:lastPayment',
                JSON.stringify({ order, sepay })
            );
            navigate(
                `/payment/qr/${order.id ?? sepay?.orderCode ?? 'mock-order'}`,
                {
                    state: {
                        order,
                        sepay,
                    },
                }
            );
        } catch (error) {
            setSubmitError(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-[calc(var(--header-height)+10px)] container space-y-3 pb-10">
            <PaymentHero />
            {isEnded ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200/90">
                    Sự kiện này đã kết thúc. Bạn không thể đặt vé mới.
                </div>
            ) : isOngoing ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200/90">
                    Sự kiện đang diễn ra. Bạn không thể đặt vé mới.
                </div>
            ) : null}
            {selectedSeatIds.length === 0 ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-500">
                    Chưa có ghế nào được chọn. Vui lòng quay lại trang đặt vé.
                </div>
            ) : null}
            {submitError ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                    {submitError}
                </div>
            ) : null}
            <OrderSummarySection event={event} ticketItems={ticketItems} />
            <PaymentMethodSection
                subtotal={subtotal}
                discountAmount={discountAmount}
                totalAmount={totalFromOrder}
                ticketCount={selectedSeatIds.length}
                couponCode={couponCode}
                onCouponCodeChange={handleCouponCodeChange}
                onApplyCoupon={handleApplyCoupon}
                appliedCouponCode={appliedCoupon?.code}
                couponError={couponError}
                couponSuccess={couponSuccess}
                isApplyingCoupon={isApplyingCoupon}
            />
            <BankTransferMethod paymentInfo={paymentInfo} />
            <ContactInformationSection customerInfo={customerInfo} />
            <PaymentActionSection
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitOrder}
                backTo={backTo}
            />
        </div>
    );
}

export default Payment;
