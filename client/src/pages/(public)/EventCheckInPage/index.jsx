import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { images } from '@/assets';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

import EventHeroSection from './components/EventHeroSection/EventHeroSection';
import OrderInfoSection from './components/OrderInfoSection/OrderInfoSection';
import OrderWarningSection from './components/OrderWarningSection/OrderWarningSection';
import PageError from './components/PageError/PageError';
import PageSkeleton from './components/PageSkeleton/PageSkeleton';
import ProcessingTimelineCard from './components/ProcessingTimelineCard/ProcessingTimelineCard';
import TicketDetailSection from './components/TicketDetailSection/TicketDetailSection';
import TicketListSection from './components/TicketListSection/TicketListSection';

import {
    getOrderPayload,
    getOrderStatusMeta,
    getSeatLabel,
    getTicketQrImageUrl,
    getTicketStatus,
    isCancelledOrder,
    isPaidOrder,
} from './helpers.js';
import QrCheckInCard from './components/QRCheckInCard/QRCheckInCard';
import RefundRequestSection from './components/RefundRequestSection/RefundRequestSection';

function EventCheckInPage() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrder = useCallback(
        async ({ silent = false } = {}) => {
            if (!id) {
                setIsLoading(false);
                setError('Không tìm thấy mã đơn hàng.');
                return;
            }

            if (!silent) {
                setIsLoading(true);
            }

            setError(null);

            try {
                const response = await orderService.getMyOrderDetail(id);
                const data = getOrderPayload(response);

                setOrder(data);

                setSelectedTicketId((currentId) => {
                    const tickets = data?.tickets ?? [];

                    if (
                        currentId &&
                        tickets.some((ticket) => ticket.id === currentId)
                    ) {
                        return currentId;
                    }

                    return tickets[0]?.id ?? null;
                });
            } catch (err) {
                setError(getErrorMessage(err));
                setOrder(null);
                setSelectedTicketId(null);
            } finally {
                if (!silent) {
                    setIsLoading(false);
                }
            }
        },
        [id]
    );

    useEffect(() => {
        void loadOrder();
    }, [loadOrder]);

    const tickets = useMemo(() => order?.tickets ?? [], [order]);

    const selectedTicket = useMemo(() => {
        return (
            tickets.find((ticket) => ticket.id === selectedTicketId) ??
            tickets[0] ??
            null
        );
    }, [selectedTicketId, tickets]);

    const hasTickets = tickets.length > 0;
    const isPaid = isPaidOrder(order);
    const isCancelled = isCancelledOrder(order);

    const pageData = useMemo(() => {
        const event = order?.event ?? {};
        const orderStatus = getOrderStatusMeta(order);
        const selectedTicketStatus = getTicketStatus(order, selectedTicket);

        return {
            event,
            orderStatus,
            selectedTicketStatus,
            bannerUrl: resolvePublicAssetUrl(event.bannerUrl) || images.home,
            qrUrl: selectedTicketStatus.canShowQr
                ? getTicketQrImageUrl(selectedTicket?.qrSecureToken)
                : null,
            selectedSeatLabel: getSeatLabel(selectedTicket),
            selectedTicketTypeName: selectedTicket?.ticketType?.name ?? '—',
        };
    }, [order, selectedTicket]);

    const ticketItems = useMemo(() => {
        return tickets.map((ticket, index) => ({
            ticket,
            index,
            seatLabel: getSeatLabel(ticket),
            status: getTicketStatus(order, ticket),
        }));
    }, [order, tickets]);

    const handleRefundSuccess = useCallback(() => {
        void loadOrder({ silent: true });
    }, [loadOrder]);

    if (isLoading) return <PageSkeleton />;

    if (error || !order) {
        return <PageError message={error} />;
    }

    return (
        <div className="px-4 pt-[calc(var(--header-height)+32px)] pb-10 sm:px-8">
            <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
                <EventHeroSection
                    event={pageData.event}
                    bannerUrl={pageData.bannerUrl}
                    orderCode={order.orderCode}
                    ticketCount={tickets.length}
                    orderStatus={pageData.orderStatus}
                />

                {!isPaid ? (
                    <OrderWarningSection
                        orderStatus={pageData.orderStatus}
                        isCancelled={isCancelled}
                        order={order}
                        sepay={order.sepay}
                    />
                ) : null}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
                    <div className="flex flex-col gap-5">
                        <TicketListSection
                            tickets={tickets}
                            ticketItems={ticketItems}
                            selectedTicket={selectedTicket}
                            hasTickets={hasTickets}
                            isPaid={isPaid}
                            onSelectTicket={setSelectedTicketId}
                        />

                        <TicketDetailSection
                            order={order}
                            selectedTicket={selectedTicket}
                            selectedTicketStatus={pageData.selectedTicketStatus}
                            selectedSeatLabel={pageData.selectedSeatLabel}
                            selectedTicketTypeName={
                                pageData.selectedTicketTypeName
                            }
                        />

                        <OrderInfoSection
                            order={order}
                            tickets={tickets}
                            orderStatus={pageData.orderStatus}
                        />
                        <RefundRequestSection
                            order={order}
                            onRefundSuccess={handleRefundSuccess}
                        />
                    </div>

                    <aside className="flex flex-col gap-5 lg:sticky lg:top-2 lg:self-start">
                        <QrCheckInCard
                            order={order}
                            isPaid={isPaid}
                            hasTickets={hasTickets}
                            qrUrl={pageData.qrUrl}
                            selectedTicketStatus={pageData.selectedTicketStatus}
                            selectedSeatLabel={pageData.selectedSeatLabel}
                            selectedTicketTypeName={
                                pageData.selectedTicketTypeName
                            }
                        />
                        <ProcessingTimelineCard
                            order={order}
                            hasTickets={hasTickets}
                            tickets={tickets}
                            selectedTicket={selectedTicket}
                            orderStatus={pageData.orderStatus}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default EventCheckInPage;
