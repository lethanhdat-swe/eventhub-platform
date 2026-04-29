import { Request, Response, NextFunction } from "express";

export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.success = ({ message, data, status = 200 }) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  res.error = ({ message, error, status = 500 }) => {
    return res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  };

  next();
};
