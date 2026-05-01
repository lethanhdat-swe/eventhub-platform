import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
        interface Response {
            success(params: {
                message: string;
                data?: any;
                status?: number;
            }): this;
            error(params: {
                message: string;
                error?: any;
                status?: number;
            }): this;
        }
    }
}
