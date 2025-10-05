import { ServerError } from "@errors/ServerError.error.js";
import { User } from "@models/user.model.js";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getVault(req: Request, res: Response): Promise<void> {
    const id = req.payload?.id;
    if (!id)
        throw new ServerError("invalid token data", StatusCodes.UNAUTHORIZED);

    const user = await User.findById(id).lean();
    if (!user) throw new ServerError("User not found", StatusCodes.NOT_FOUND);

    res.status(StatusCodes.OK).json({ vault: user.vault || "" });
}

interface UpdateVaultRequest {
    vault: string;
}

export async function updateVault(
    req: Request<unknown, unknown, UpdateVaultRequest, unknown>,
    res: Response,
): Promise<void> {
    const id = req.payload?.id;
    if (!id)
        throw new ServerError("invalid token data", StatusCodes.UNAUTHORIZED);

    const user = await User.findById(id).exec();
    if (!user) throw new ServerError("User not found", StatusCodes.NOT_FOUND);

    const { vault } = req.body;
    if (!vault) {
        throw new ServerError("Vault is required", StatusCodes.BAD_REQUEST);
    }

    user.vault = vault;
    await user.save();

    res.status(StatusCodes.OK).end();
}
