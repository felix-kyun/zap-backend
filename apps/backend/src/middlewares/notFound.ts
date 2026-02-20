import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ServerError } from "@/errors/ServerError.js";

export function notFoundMiddleware(
	_req: Request,
	_res: Response,
	_next: NextFunction,
): void {
	throw new ServerError("Not Found", StatusCodes.NOT_FOUND);
}
