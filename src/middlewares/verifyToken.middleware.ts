import { ServerError } from "@errors/ServerError.error.js";
import { verifyAccessToken } from "@services/auth.js";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function verifyTokenMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    const accessToken = req.cookies.accessToken as string;

    if (!accessToken)
        throw new ServerError(
            "No access token provided",
            StatusCodes.UNAUTHORIZED,
        );

    const payload = verifyAccessToken(accessToken);

    if (!payload)
        throw new ServerError("Invalid access token", StatusCodes.UNAUTHORIZED);

    req.payload = payload;

    next();
}
