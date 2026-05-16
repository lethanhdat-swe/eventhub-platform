import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";
    let errorDetail = err;

    if (err instanceof multer.MulterError) {
        status = 400;
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                message = "File size exceeds 5MB limit";
                break;
            case "LIMIT_FILE_COUNT":
            case "LIMIT_UNEXPECTED_FILE":
                message = "Too many files or invalid upload field name";
                break;
            default:
                message = err.message;
        }
        errorDetail = err;
    }

    // Handle Prisma Specific Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                status = 400;
                const field =
                    (err.meta?.target as string[])?.join(", ") || "field";
                message = `Duplicate value. Please use another value.`;
                errorDetail = {
                    code: err.code,
                    message: (err as any)?.meta?.driverAdapterError.cause
                        .originalMessage,
                };
                break;
            case "P2025":
                status = 404;
                message = "Record not found";
                break;
            default:
                status = 400;
                message = "Database operation failed";
        }
    }

    // Log error stack for debugging in development
    console.error(`[Error] ${err.stack || err.message}`);

    return res.error({
        message,
        error: process.env.NODE_ENV === "development" ? errorDetail : undefined,
        status,
    });
};
