import { ENV } from "@config";
import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import {
    generateAccessToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "@services/auth.js";
import { redis } from "@utils/database/redis.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface LogoutResponse {
    message: string;
}

export async function logout(
    req: Request,
    res: Response<LogoutResponse>,
): Promise<void> {
    const refreshToken = String(req.cookies.refreshToken);

    if (refreshToken) {
        await redis.del(`refresh:${refreshToken}`);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
    }

    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
}

interface RefreshResponse {
    token: string;
}

export async function refresh(
    req: Request,
    res: Response<RefreshResponse>,
): Promise<void> {
    const refreshToken = String(req.cookies.refreshToken);

    if (!refreshToken)
        throw new ServerError(
            "No refresh token provided",
            StatusCodes.UNAUTHORIZED,
        );

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload)
        throw new ServerError(
            "Invalid refresh token",
            StatusCodes.UNAUTHORIZED,
        );

    const accessToken = generateAccessToken(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(StatusCodes.OK).json({ token: accessToken });
}

export function AuthStatus(
    req: Request,
    res: Response<{ authenticated: boolean }>,
): void {
    const accessToken = req.cookies.accessToken as string;

    if (!accessToken || !verifyAccessToken(accessToken)) {
        res.status(StatusCodes.UNAUTHORIZED).json({ authenticated: false });
        return;
    }

    res.status(StatusCodes.OK).json({ authenticated: true });
}

interface CurrentUserResponse {
    id: string;
    email: string;
    username: string;
}

export async function getCurrentUser(
    req: Request,
    res: Response<CurrentUserResponse>,
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

    const user = await User.findById(payload.id).exec();

    if (!user) throw new ServerError("User not found", StatusCodes.NOT_FOUND);

    res.status(StatusCodes.OK).json({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
    });
}
