import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

export const isAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Check if token exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required", 401);
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify signature and Check expired
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new AppError("Token expired", 401);
            }
            throw new AppError("Invalid token", 401);
        }

        // 3. Ensure User exists in Database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true },
        });

        if (!user) {
            throw new AppError("User not found", 401);
        }

        // 4. Attach user information to request
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    // Public route: no token means continue as guest.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true },
        });
        console.log(user);
        
        if (user) {
            req.user = user;
        }
    } catch {
        // Optional auth must not block guest flows when a stale token is sent.
    }

    return next();
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            );
        }
        next();
    };
};

export const isAdmin = restrictTo("ADMIN");
