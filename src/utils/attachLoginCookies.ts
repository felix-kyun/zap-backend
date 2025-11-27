import { ENV } from "@config";
import type { IUser } from "@models/user.model.js";
import {
    generateAccessTokenFromUser,
    generateRefreshToken,
} from "@services/auth.js";
import { generateSessionId } from "@utils/generateSessionId.js";
import type { Response } from "express";

export async function attachLoginCookies(user: IUser, res: Response) {
    const sessionId = generateSessionId();

    const refreshToken = await generateRefreshToken(user, sessionId);
    const accessToken = generateAccessTokenFromUser(user, sessionId);

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
}
