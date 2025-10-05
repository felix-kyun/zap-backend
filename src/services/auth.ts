import { JWT_REFRESH_SECRET, JWT_SECRET } from "@config";
import type { IUser } from "@models/user.model.js";
import { redis } from "@utils/database/redis.js";
import jwt from "jsonwebtoken";
import type mongoose from "mongoose";

export interface Payload {
    id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    session: string;
}

export async function generateRefreshToken(
    user: IUser,
    session: string,
): Promise<string> {
    const payload: Payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        session,
    };

    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });

    await redis.set(`refresh:${refreshToken}`, user._id.toString(), {
        EX: 7 * 24 * 60 * 60,
    });

    return refreshToken;
}

export function generateAccessTokenFromUser(
    user: IUser,
    session: string,
): string {
    const payload: Payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        session,
    };

    return generateAccessToken(payload);
}

export function generateAccessToken({
    id,
    username,
    email,
    session,
}: Payload): string {
    return jwt.sign(
        {
            id,
            username,
            email,
            session,
        },
        JWT_SECRET,
        { expiresIn: "15m" },
    );
}

export async function verifyRefreshToken(
    token: string,
): Promise<Payload | null> {
    try {
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as Payload;
        const exists = await redis.get(`refresh:${token}`);

        if (!exists) return null;
        return decoded;
    } catch {
        return null;
    }
}

export function verifyAccessToken(token: string): Payload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Payload;
        return decoded;
    } catch {
        return null;
    }
}
