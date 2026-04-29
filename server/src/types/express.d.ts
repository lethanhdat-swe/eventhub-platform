import * as express from "express";

declare global {
    namespace Express {
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
