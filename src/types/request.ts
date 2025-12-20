import type { IUser } from "@models/user.model.js";
import type { Request, Response } from "express";

export interface AuthenticatedRequest<
    P = Request["params"],
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Request["query"],
    Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    user: IUser;
}

export type AuthenticatedRequestHandler<
    P = Request["params"],
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Request["query"],
    Locals extends Record<string, unknown> = Record<string, unknown>,
> = (
    req: AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response,
) => Promise<void> | void;
