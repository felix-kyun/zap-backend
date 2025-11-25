import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import Opaque from "@services/opaque.js";
import { generateOTP, verifyOTP } from "@services/otp.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface RegistrationStartRequest {
    email: string;
    request: string;
}

interface RegistrationStartResponse {
    response: string;
}

export async function registerStart(
    req: Request<
        unknown,
        RegistrationStartResponse,
        RegistrationStartRequest,
        unknown
    >,
    res: Response<RegistrationStartResponse>,
) {
    const { email, request } = req.body;

    if (!email || !request)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

    const existingUser = await User.findOne({
        email,
    });

    if (existingUser && existingUser.email === email)
        throw new ServerError("Email already exists", StatusCodes.CONFLICT);

    await generateOTP(email);

    const response = Opaque.startRegistration(email, request);

    res.status(StatusCodes.OK).json({
        response,
    });
}

interface RegistrationFinishRequest {
    username: string;
    email: string;
    otp: string;
    record: string;
}

export async function registerFinish(
    req: Request<unknown, unknown, RegistrationFinishRequest, unknown>,
    res: Response,
) {
    const { username, email, record, otp } = req.body;

    if (!username || !email || !record || !otp)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

    const existingUser = await User.findOne({
        email,
    });

    if (existingUser && existingUser.email === email)
        throw new ServerError("Email already exists", StatusCodes.CONFLICT);

    await verifyOTP(email, otp);

    const user = await User.create({
        username,
        email,
        record,
    });

    res.status(StatusCodes.CREATED).json({
        id: user._id,
        username: user.username,
        email: user.email,
    });
}
