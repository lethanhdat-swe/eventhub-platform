import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
    message: z.string().min(1, "Nội dung liên hệ không được để trống"),
  }),
});

export const deleteContactSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID không hợp lệ"),
  }),
});