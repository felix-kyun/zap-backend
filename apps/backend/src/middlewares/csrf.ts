import crypto from "node:crypto";
import { ServerError } from "@/errors/ServerError.js";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// simple middleware implementing Double Submit Cookie pattern
export const csrf =
	() =>
	(req: Request, res: Response, next: NextFunction): void => {
		if (!req.cookies?.csrf_token) {
			const token: string = crypto.randomBytes(32).toString("hex");
			res.cookie("csrf_token", token, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
		}

		next();
	};

export const verifyCsrf =
	() =>
	(req: Request, _res: Response, next: NextFunction): void => {
		const csrfCookie = req.cookies?.csrf_token as string;
		const csrfHeader = req.headers["x-csrf-token"];

		if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader)
			throw new ServerError("Invalid CSRF token", StatusCodes.FORBIDDEN);

		next();
	};
