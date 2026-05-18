import { EventStatus, OrderStatus, Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

const PAID_STATUS = OrderStatus.PAID;

type DateRangeBounds = { start: Date; end: Date };

type OrderForRevenue = { createdAt: Date; totalAmount: number | null };

type OrderForCustomer = {
    customerName: string | null;
    user?: { fullName: string } | null;
};

function parseInputDate(value: string): Date {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getDateRange(from?: string, to?: string): DateRangeBounds {
    const today = new Date();
    const end = to ? endOfDay(parseInputDate(to)) : endOfDay(today);
    const start = from
        ? startOfDay(parseInputDate(from))
        : startOfDay(addDays(today, -29));

    if (start > end) {
        throw new AppError("'from' must be less than or equal to 'to'", 400);
    }

    return { start, end };
}

export function getPreviousDateRange(start: Date, end: Date): DateRangeBounds {
    const msPerDay = 24 * 60 * 60 * 1000;
    const dayCount =
        Math.floor((endOfDay(end).getTime() - startOfDay(start).getTime()) / msPerDay) +
        1;

    const prevEnd = endOfDay(addDays(start, -1));
    const prevStart = startOfDay(addDays(prevEnd, -(dayCount - 1)));

    return { start: prevStart, end: prevEnd };
}

export function calcGrowthPercent(current: number, previous: number): number {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return Math.round(((current - previous) / previous) * 100);
}

export function calcGrowthDelta(current: number, previous: number): number {
    return current - previous;
}

export function resolveCustomerName(order: OrderForCustomer): string {
    return (
        order.customerName?.trim() ||
        order.user?.fullName?.trim() ||
        "Khách hàng"
    );
}

function paidOrderCreatedInRange(range: DateRangeBounds): Prisma.OrderWhereInput {
    return {
        status: PAID_STATUS,
        createdAt: { gte: range.start, lte: range.end },
    };
}

function soldTicketsWhere(range: DateRangeBounds): Prisma.TicketWhereInput {
    return {
        order: paidOrderCreatedInRange(range),
    };
}

function activeEventsWhere(range: DateRangeBounds): Prisma.EventWhereInput {
    return {
        status: EventStatus.PUBLISHED,
        AND: [
            {
                OR: [{ startDate: null }, { startDate: { lte: range.end } }],
            },
            {
                OR: [{ endDate: null }, { endDate: { gte: range.start } }],
            },
        ],
    };
}

async function getTotalRevenue(range: DateRangeBounds): Promise<number> {
    const result = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: paidOrderCreatedInRange(range),
    });
    return result._sum.totalAmount ?? 0;
}

async function getSoldTickets(range: DateRangeBounds): Promise<number> {
    return prisma.ticket.count({ where: soldTicketsWhere(range) });
}

async function getCheckedInTickets(range: DateRangeBounds): Promise<number> {
    return prisma.ticket.count({
        where: {
            ...soldTicketsWhere(range),
            isCheckedIn: true,
        },
    });
}

async function getActiveEvents(range: DateRangeBounds): Promise<number> {
    return prisma.event.count({ where: activeEventsWhere(range) });
}

function calcCheckinRate(checkedIn: number, sold: number): number {
    if (sold === 0) return 0;
    return Math.round((checkedIn / sold) * 100);
}

export function groupRevenueByPeriod(
    orders: OrderForRevenue[],
    start: Date,
    end: Date
): { label: string; revenue: number }[] {
    const msPerDay = 24 * 60 * 60 * 1000;
    const dayCount =
        Math.floor((endOfDay(end).getTime() - startOfDay(start).getTime()) / msPerDay) +
        1;

    const buckets = new Map<string, number>();

    if (dayCount <= 31) {
        for (let i = 0; i < dayCount; i++) {
            const d = addDays(startOfDay(start), i);
            const key = toInputDate(d);
            buckets.set(key, 0);
        }

        for (const order of orders) {
            const key = toInputDate(order.createdAt);
            if (!buckets.has(key)) continue;
            buckets.set(key, (buckets.get(key) ?? 0) + (order.totalAmount ?? 0));
        }

        return Array.from(buckets.entries()).map(([key, revenue]) => {
            const [, month, day] = key.split("-");
            return { label: `${day}/${month}`, revenue };
        });
    }

    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= endMonth) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
        buckets.set(key, 0);
        cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const order of orders) {
        const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
        if (!buckets.has(key)) continue;
        buckets.set(key, (buckets.get(key) ?? 0) + (order.totalAmount ?? 0));
    }

    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

    return Array.from(buckets.entries()).map(([key, revenue]) => {
        const [year, month] = key.split("-").map(Number);
        const label = monthFormatter.format(new Date(year, month - 1, 1));
        return { label, revenue };
    });
}

class DashboardService {
    async getSummary(query: { from?: string; to?: string }) {
        const range = getDateRange(query.from, query.to);
        const previousRange = getPreviousDateRange(range.start, range.end);

        const [
            totalRevenue,
            soldTickets,
            activeEvents,
            checkedInTickets,
            prevRevenue,
            prevSoldTickets,
            prevActiveEvents,
            prevCheckedInTickets,
            revenueOrders,
            recentOrdersRaw,
            topEventsRaw,
            recentCheckinsRaw,
        ] = await Promise.all([
            getTotalRevenue(range),
            getSoldTickets(range),
            getActiveEvents(range),
            getCheckedInTickets(range),
            getTotalRevenue(previousRange),
            getSoldTickets(previousRange),
            getActiveEvents(previousRange),
            getCheckedInTickets(previousRange),
            prisma.order.findMany({
                where: paidOrderCreatedInRange(range),
                select: { createdAt: true, totalAmount: true },
            }),
            prisma.order.findMany({
                where: { createdAt: { gte: range.start, lte: range.end } },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    orderCode: true,
                    customerName: true,
                    totalAmount: true,
                    status: true,
                    createdAt: true,
                    user: { select: { fullName: true } },
                },
            }),
            prisma.$queryRaw<
                Array<{
                    id: string;
                    name: string;
                    date: Date | null;
                    sold_tickets: bigint | number;
                }>
            >`
                SELECT e.id, e.title AS name, e.start_date AS date, COUNT(t.id) AS sold_tickets
                FROM tickets t
                INNER JOIN orders o ON t.order_id = o.id
                INNER JOIN event_seats es ON t.event_seat_id = es.id
                INNER JOIN events e ON es.event_id = e.id
                WHERE o.status = ${PAID_STATUS}
                  AND o.created_at >= ${range.start}
                  AND o.created_at <= ${range.end}
                GROUP BY e.id, e.title, e.start_date
                ORDER BY sold_tickets DESC
                LIMIT 5
            `,
            prisma.ticket.findMany({
                where: {
                    isCheckedIn: true,
                    checkedInAt: { gte: range.start, lte: range.end },
                },
                orderBy: { checkedInAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    checkedInAt: true,
                    qrSecureToken: true,
                    order: {
                        select: {
                            customerName: true,
                            user: { select: { fullName: true } },
                        },
                    },
                    eventSeat: {
                        select: {
                            event: { select: { title: true } },
                        },
                    },
                },
            }),
        ]);

        const checkinRate = calcCheckinRate(checkedInTickets, soldTickets);
        const prevCheckinRate = calcCheckinRate(
            prevCheckedInTickets,
            prevSoldTickets
        );

        const revenueChart = groupRevenueByPeriod(
            revenueOrders,
            range.start,
            range.end
        );

        const recentOrders = recentOrdersRaw.map((order) => ({
            id: order.id,
            orderCode: order.orderCode ?? order.id.slice(0, 8).toUpperCase(),
            customerName: resolveCustomerName(order),
            totalAmount: order.totalAmount ?? 0,
            status: order.status,
            createdAt: order.createdAt,
        }));

        const topEvents = topEventsRaw.map((row) => ({
            id: row.id,
            name: row.name,
            date: row.date,
            soldTickets: Number(row.sold_tickets),
        }));

        const recentCheckins = recentCheckinsRaw.map((ticket) => ({
            id: ticket.id,
            customerName: resolveCustomerName(ticket.order),
            ticketCode: ticket.qrSecureToken ?? ticket.id,
            eventName: ticket.eventSeat?.event?.title ?? null,
            checkedInAt: ticket.checkedInAt,
        }));

        return {
            stats: {
                totalRevenue,
                soldTickets,
                activeEvents,
                checkinRate,
                revenueGrowthPercent: calcGrowthPercent(totalRevenue, prevRevenue),
                soldTicketsGrowthPercent: calcGrowthPercent(
                    soldTickets,
                    prevSoldTickets
                ),
                activeEventsGrowth: calcGrowthDelta(activeEvents, prevActiveEvents),
                checkinRateGrowthPercent: calcGrowthPercent(
                    checkinRate,
                    prevCheckinRate
                ),
            },
            revenueChart,
            recentOrders,
            topEvents,
            recentCheckins,
        };
    }
}

export default new DashboardService();
