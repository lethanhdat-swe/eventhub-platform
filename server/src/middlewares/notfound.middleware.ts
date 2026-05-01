import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.error({
    message: `Route ${req.originalUrl} not found`,
    status: 404,
  });
};
