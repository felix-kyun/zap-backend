import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import Opaque from "@services/opaque.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface RegistrationStartRequest {
    username: string;
    request: string;
}

interface RegistrationStartResponse {
    response: string;
}

export function registerStart(
    req: Request<
        unknown,
        RegistrationStartResponse,
        RegistrationStartRequest,
        unknown
    >,
    res: Response<RegistrationStartResponse>,
) {
    const { username, request } = req.body;

    if (!username || !request)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

    const response = Opaque.startRegistration(username, request);

    res.status(StatusCodes.OK).json({
        response,
    });
}

interface RegistrationFinishRequest {
    username: string;
    email: string;
    name: string;
    record: string;
}

export async function registerFinish(
    req: Request<unknown, unknown, RegistrationFinishRequest, unknown>,
    res: Response,
) {
    const { username, email, name, record } = req.body;

    if (!username || !email || !name || !record)
        throw new ServerError(
            "Missing required fields",
            StatusCodes.BAD_REQUEST,
        );

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser && existingUser.username === username)
        throw new ServerError("Username already exists", StatusCodes.CONFLICT);

    if (existingUser && existingUser.email === email)
        throw new ServerError("Email already exists", StatusCodes.CONFLICT);

    const user = await User.create({
        username,
        email,
        name,
        record,
    });

    res.status(StatusCodes.CREATED).json({
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
    });
}
