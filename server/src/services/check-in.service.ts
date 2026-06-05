import { getPaginationMetadata } from "../utils/pagination";
import {
    ListCheckInHistoryInput,
    ScanCheckInInput,
} from "../schema/check-in.schema";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import notificationService from "./notification.service";
import { NotificationType } from "@prisma/client";
import { buildDirectOrderBy } from "../utils/listSort";

class CheckInService {
    async scan(data: ScanCheckInInput) {
        const { token } = data;

        const ticket = await prisma.ticket.findUnique({
            where: { qrSecureToken: token },
            select: {
                id: true,
                isCheckedIn: true,
                checkedInAt: true,
                order: {
                    select: {
                        id: true,
                        status: true,
                        orderCode: true,
                        customerName: true,
                        customerEmail: true,
                    },
                },
                eventSeat: {
                    select: {
                        rowLabel: true,
                        seatNumber: true,
                        ticketType: {
                            select: { name: true },
                        },
                        event: {
                            select: {
                                id: true,
                                title: true,
                                startDate: true,
                                endDate: true,
                                location: true,
                            },
                        },
                    },
                },
            },
        });

        if (!ticket) {
            await prisma.checkInLog.create({
                data: {
                    token,
                    status: "INVALID",
                    message: "Ticket not found or invalid QR token",
                },
            });

            await notificationService.createNotification({
                type: NotificationType.CHECKIN_CREATED,
                title: "Lượt check-in mới",
                message: "Có một lượt quét vé không hợp lệ.",
            });

            throw new AppError("Ticket not found or invalid QR token", 404);
        }

        if (ticket.order.status !== "PAID") {
            await prisma.checkInLog.create({
                data: {
                    ticketId: ticket.id,
                    token,
                    status: "INVALID",
                    message: "Ticket order is not paid",
                },
            });

            await notificationService.createNotification({
                type: NotificationType.CHECKIN_CREATED,
                title: "Lượt check-in mới",
                message: `Vé thuộc đơn hàng ${ticket.order.orderCode} vừa được quét nhưng đơn hàng chưa thanh toán.`,
            });

            throw new AppError("Ticket order is not paid", 400);
        }

        if (ticket.isCheckedIn) {
            await prisma.checkInLog.create({
                data: {
                    ticketId: ticket.id,
                    token,
                    status: "DUPLICATE",
                    message: "Ticket has already been checked in",
                },
            });

            await notificationService.createNotification({
                type: NotificationType.CHECKIN_CREATED,
                title: "Lượt check-in mới",
                message: `Vé của ${ticket.order.customerName || ticket.order.customerEmail} tại sự kiện ${ticket.eventSeat.event.title} đã được quét trước đó.`,
            });

            throw new AppError("Ticket has already been checked in", 409);
        }

        const checkedInAt = new Date();

        const checkedInTicket = await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
                isCheckedIn: true,
                checkedInAt,
            },
            select: {
                id: true,
                isCheckedIn: true,
                checkedInAt: true,
            },
        });

        await prisma.checkInLog.create({
            data: {
                ticketId: ticket.id,
                token,
                status: "VALID",
                message: "Ticket checked in successfully",
            },
        });

        await notificationService.createNotification({
            type: NotificationType.CHECKIN_CREATED,
            title: "Lượt check-in mới",
            message: `Vé của ${ticket.order.customerName || ticket.order.customerEmail} tại sự kiện ${ticket.eventSeat.event.title} vừa được check-in thành công.`,
        });

        return {
            id: checkedInTicket.id,
            ticketId: checkedInTicket.id,
            status: "VALID",
            isCheckedIn: checkedInTicket.isCheckedIn,
            checkedInAt: checkedInTicket.checkedInAt,
            orderCode: ticket.order.orderCode,
            customerName: ticket.order.customerName,
            customerEmail: ticket.order.customerEmail,
            seatLabel: `${ticket.eventSeat.rowLabel}-${ticket.eventSeat.seatNumber}`,
            ticketType: ticket.eventSeat.ticketType.name,
            event: ticket.eventSeat.event,
        };
    }

    async history(query: ListCheckInHistoryInput) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            eventId,
            sortBy,
            sortOrder,
        } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (eventId) {
            where.ticket = {
                eventSeat: {
                    eventId,
                },
            };
        }

        if (search) {
            where.OR = [
                { token: { contains: search } },
                { message: { contains: search } },
                {
                    ticket: {
                        order: {
                            OR: [
                                { orderCode: { contains: search } },
                                { customerName: { contains: search } },
                                { customerEmail: { contains: search } },
                            ],
                        },
                    },
                },
                {
                    ticket: {
                        eventSeat: {
                            event: {
                                title: { contains: search },
                            },
                        },
                    },
                },
            ];
        }

        const orderBy = buildDirectOrderBy(
            sortBy,
            sortOrder,
            {
                scannedAt: "scannedAt",
                status: "status",
            },
            { scannedAt: "desc" }
        );

        const [logs, total] = await Promise.all([
            prisma.checkInLog.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
                include: {
                    ticket: {
                        include: {
                            order: true,
                            eventSeat: {
                                include: {
                                    event: true,
                                    ticketType: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.checkInLog.count({ where }),
        ]);

        return {
            data: logs.map((log) => ({
                id: log.id,
                token: log.token,
                status: log.status,
                message: log.message,
                scannedAt: log.scannedAt,
                ticketId: log.ticketId,
                orderCode: log.ticket?.order?.orderCode ?? null,
                customerName: log.ticket?.order?.customerName ?? null,
                customerEmail: log.ticket?.order?.customerEmail ?? null,
                eventTitle: log.ticket?.eventSeat?.event?.title ?? null,
                seatLabel: log.ticket
                    ? `${log.ticket.eventSeat.rowLabel}-${log.ticket.eventSeat.seatNumber}`
                    : null,
                ticketType: log.ticket?.eventSeat?.ticketType?.name ?? null,
            })),
            meta: getPaginationMetadata(total, page, limit),
        };
    }
}

export default new CheckInService();
