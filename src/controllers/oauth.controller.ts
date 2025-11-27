import { GOOGLE_CLIENT_ID } from "@config";
import { BadRequestError } from "@errors/BadRequestError.error.js";
import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import { attachLoginCookies } from "@utils/attachLoginCookies.js";
import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { StatusCodes } from "http-status-codes";

import type { LoginResponse } from "@/types/login.types.js";

interface GoogleLoginRequest {
    idToken: string;
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
export async function googleLogin(
    req: Request<unknown, unknown, GoogleLoginRequest>,
    res: Response<LoginResponse>,
) {
    const { idToken } = req.body;

    if (!idToken) throw new BadRequestError();

    const ticket = await googleClient.verifyIdToken({
        idToken,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload?.sub)
        throw new ServerError(
            "Invalid Google ID token",
            StatusCodes.UNAUTHORIZED,
        );

    const email = payload.email;
    const username = payload.name ?? email.split("@")[0] ?? "User";

    let user = await User.findOne({ email });

    user ??= await User.create({
        email,
        username,
        auth: {
            type: "google",
            data: payload.sub,
        },
    });

    await attachLoginCookies(user, res);

    res.status(StatusCodes.OK).json({
        id: user._id.toString(),
        username,
        email,
    });
}
