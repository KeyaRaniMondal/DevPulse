import type { NextFunction, Response } from "express"
import type { AuthRequest } from "./auth.middleware"
import { StatusCodes } from "http-status-codes"

export const requireRole = (...roles: string[]) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Insufficient permissions"
            })
        }
        next()
    }
}