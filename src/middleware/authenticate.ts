import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/response';
import jwt from 'jsonwebtoken'
import type { jwtPayload } from '../types';
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers['authorization']
    if (!token) {
        sendError(res, StatusCodes.UNAUTHORIZED, 'Access denied')
        return
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        ) as jwtPayload
        req.user = decoded
        next()
    }
    catch (error) {
        sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid token')
        return
    }

}