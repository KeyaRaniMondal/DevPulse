import type { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: unknown,
  errors?: unknown
) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    errors
  });
};