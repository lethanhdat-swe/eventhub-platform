import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            next();
        } catch (err: any) {
            if (err instanceof ZodError) {
                // Chỉ lấy những thông tin cần thiết: field nào, lỗi gì
                const details = err.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                }));

                return res.error({
                    message: "Validation failed",
                    error: details, // Trả về mảng đã format đẹp
                    status: 400,
                });
            }

            return res.error({
                message: "Validation failed",
                error: err,
                status: 400,
            });
        }
    };
