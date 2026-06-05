import { z } from "zod";
import { listSortQueryFields } from "../utils/listSort";

export const createContactSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
    message: z.string().min(1, "Nội dung liên hệ không được để trống"),
  }),
});

export const listContactSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => Math.max(Number(val) || 1, 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => Math.max(Number(val) || 10, 1)),
    ...listSortQueryFields(["fullName", "email", "createdAt"] as const),
  }),
});

export const deleteContactSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ"),
  }),
});