import { ServerError } from "@/errors/ServerError.error.js";
import { Controller, Middleware, Post } from "@felix-kyun/file-router";
import { verifyCsrf } from "@/middlewares/csrf.middleware.js";
import { User } from "@/models/user.model.js";
import Opaque from "@/services/opaque.js";
import { attachLoginCookies } from "@/utils/attachLoginCookies.js";
import { redis } from "@/utils/database/redis.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { LoginResponse } from "@/types/login.types.js";

interface LoginStartRequest {
	email: string;
	request: string;
}

interface LoginStartResponse {
	response: string;
	session: string;
}

interface LoginFinishRequest {
	session: string;
	request: string;
}

@Middleware(verifyCsrf())
@Controller("/login")
export class LoginController {
	@Post("/start")
	async start(
		req: Request<unknown, LoginStartResponse, LoginStartRequest>,
		res: Response<LoginStartResponse>,
	) {
		const { request, email } = req.body;

		if (!request || !email)
			throw new ServerError("Missing required fields", StatusCodes.BAD_REQUEST);

		const user = await User.findOne({ email }).lean();

		if (!user) throw new ServerError("User not found", StatusCodes.NOT_FOUND);

		const { state, response } = Opaque.startLogin(
			email,
			user.auth.data,
			request,
		);

		const session = crypto.randomUUID();

		await redis.set(
			`authSession:${session}`,
			JSON.stringify({
				state,
				email,
			}),
			{ EX: 60 * 5 },
		);

		res.status(StatusCodes.OK).json({
			response,
			session,
		});
	}

	@Post("/finish")
	async finish(
		req: Request<unknown, LoginResponse, LoginFinishRequest>,
		res: Response<LoginResponse>,
	) {
		const { session, request } = req.body;

		if (!session || !request)
			throw new ServerError("Missing required fields", StatusCodes.BAD_REQUEST);

		const authSession = await redis.get(`authSession:${session}`);

		if (!authSession)
			throw new ServerError(
				"Invalid or expired session",
				StatusCodes.BAD_REQUEST,
			);

		const { state, email } = JSON.parse(authSession) as {
			state: string;
			email: string;
		};

		Opaque.finishLogin(state, request);

		await redis.del(`authSession:${session}`);

		const user = await User.findOne({ email }).lean();

		// This should never happen
		// as we already checked for user existence in loginStart
		if (!user)
			throw new ServerError("Server error", StatusCodes.INTERNAL_SERVER_ERROR);

		// attach tokens
		await attachLoginCookies(user, res);

		res.status(StatusCodes.OK).json({
			id: user._id.toString(),
			email: user.email,
			username: user.username,
		});
	}
}
