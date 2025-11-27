import { ENV } from "@config";
import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import {
    generateAccessTokenFromUser,
    generateRefreshToken,
} from "@services/auth.js";
import Opaque from "@services/opaque.js";
import { redis } from "@utils/database/redis.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface LoginStartRequest {
    email: string;
    request: string;
}

interface LoginStartResponse {
    response: string;
    session: string;
}

export async function loginStart(
    req: Request<unknown, LoginStartResponse, LoginStartRequest>,
    res: Response<LoginStartResponse>,
) {
    const { request, email } = req.body;

    if (!request || !email)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

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

interface LoginFinishRequest {
    session: string;
    request: string;
}

export async function loginFinish(
    req: Request<unknown, unknown, LoginFinishRequest>,
    res: Response,
) {
    const { session, request } = req.body;

    if (!session || !request)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

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

    const sessionKey = Opaque.finishLogin(state, request);

    await redis.del(`authSession:${session}`);

    const user = await User.findOne({ email }).lean();

    // This should never happen
    // as we already checked for user existence in loginStart
    if (!user)
        throw new ServerError(
            "Server error",
            StatusCodes.INTERNAL_SERVER_ERROR,
        );

    // generate tokens
    const refreshToken = await generateRefreshToken(user, sessionKey);
    const accessToken = generateAccessTokenFromUser(user, sessionKey);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("authenticated", "true", {
        httpOnly: false,
        secure: ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(StatusCodes.OK).json({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
    });
}
