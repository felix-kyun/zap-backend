import { ServerError } from "@errors/ServerError.error.js";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function ensureVaultExistsMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    if (!req.user?.vault)
        throw new ServerError(
            "Vault doesn't exsist, please create a new vault",
            StatusCodes.NOT_FOUND,
        );

    next();
}
