import type { Response } from 'express';

export const sendError = (
    res: Response,
    statusCode: number,
    message: string
): Response => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};

