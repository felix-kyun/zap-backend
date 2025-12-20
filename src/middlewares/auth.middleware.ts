import { ServerError } from "@errors/ServerError.error.js";
import { verifyAccessToken } from "@services/auth.js";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "@models/user.model.js";
import type { AuthenticatedRequestHandler } from "@/types/request.js";

export async function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> {
    const accessToken = req.cookies.accessToken as string;
    if (!accessToken)
        throw new ServerError(
            "No access token provided",
            StatusCodes.UNAUTHORIZED,
        );

    const payload = verifyAccessToken(accessToken);
    if (!payload)
        throw new ServerError("Invalid access token", StatusCodes.UNAUTHORIZED);

    const id = payload.id;
    if (!id)
        throw new ServerError("invalid token data", StatusCodes.UNAUTHORIZED);

    const user = await User.findById(id).exec();
    if (!user) throw new ServerError("User not found", StatusCodes.NOT_FOUND);

    req.user = user;

    next();
}

export function asRequestHandler<
    P = Request["params"],
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Request["query"],
    Locals extends Record<string, unknown> = Record<string, unknown>,
>(
    handler: AuthenticatedRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler {
    return handler as unknown as RequestHandler;
}
