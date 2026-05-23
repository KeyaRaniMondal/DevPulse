import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { loginUser, signupUser } from "./auth.service"
import { loginSchema, signupSchema } from "./auth.validation"

export const signupController = async (req: Request, res: Response) => {
    try {
        const parsed = signupSchema.parse(req.body)
        const user = await signupUser(parsed)
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: user
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message
        })
    }
}
export const loginController = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.parse(req.body)
        const user = await loginUser(parsed.email, parsed.password)
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Login successful",
            data: user
        })
    } catch (error: any) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: error.message
        })
    }
}