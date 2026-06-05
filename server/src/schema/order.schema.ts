import { z } from "zod";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { listSortQueryFields } from "../utils/listSort";

const paramsIdSchema = z.object({
    id: z.string().uuid("Invalid order ID format"),
});

export const createOrderSchema = z.object({
    body: z.object({
        customerEmail: z.string().email("Invalid customer email"),
        customerPhone: z.string().min(10, "Invalid customer phone number"),
        customerName: z.string().min(1, "Customer name is required"),
        eventSeatIds: z
            .array(z.string().uuid())
            .min(1, "At least one seat must be selected"),
        couponCode: z.string().optional(),
        paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.SEPAY),
    }),
});

export const listOrderSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform((val) => Math.max(1, parseInt(val))),
        limit: z
            .string()
            .optional()
            .default("10")
            .transform((val) => Math.max(1, parseInt(val))),
        search: z.string().optional(),
        status: z.nativeEnum(OrderStatus).optional(),
        ...listSortQueryFields([
            "orderCode",
            "customerName",
            "customerEmail",
            "totalAmount",
            "paymentMethod",
            "status",
            "createdAt",
        ] as const),
    }),
});

export const listMyOrderSchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .default("1")
            .transform((val) => Math.max(1, parseInt(val))),
        limit: z
            .string()
            .optional()
            .default("10")
            .transform((val) => Math.max(1, parseInt(val))),
        status: z.nativeEnum(OrderStatus).optional(),
    }),
});

export const deleteOrderSchema = z.object({
    body: z.object({
        ids: z
            .array(z.string().uuid("Invalid ID format"))
            .min(1, "At least one ID is required"),
    }),
});

export const getOrderSchema = z.object({
    params: paramsIdSchema,
});

export const exportMyOrderTicketPdfSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid order id."),
    }),
});

export const lookupOrderByCodeSchema = z.object({
    params: z.object({
        orderCode: z
            .string()
            .trim()
            .min(1, "Vui lòng nhập mã đơn hàng.")
            .regex(/^EH/i, "Mã đơn hàng phải bắt đầu bằng EH (ví dụ: EH1730...)."),
    }),
});
