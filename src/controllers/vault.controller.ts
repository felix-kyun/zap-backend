import { ServerError } from "@errors/ServerError.error.js";
import type { IVault, IVaultItem } from "@models/vault.schema.js";
import type { AuthenticatedRequest } from "@/types/request.js";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function getVault(
    req: AuthenticatedRequest,
    res: Response,
): Promise<void> {
    res.status(StatusCodes.OK).json(req.user.vault);
}

export async function createVault(
    req: AuthenticatedRequest<unknown, unknown, IVault, unknown>,
    res: Response<IVault>,
): Promise<void> {
    const user = req.user;
    if (user.vault)
        throw new ServerError(
            "Vault already exists, please update instead",
            StatusCodes.CONFLICT,
        );

    const vault = req.body;
    if (!vault) {
        throw new ServerError("Vault is required", StatusCodes.BAD_REQUEST);
    }

    user.vault = vault;
    await user.save();

    res.status(StatusCodes.OK).json(user.vault);
}

export async function replaceVault(
    req: AuthenticatedRequest<unknown, unknown, IVault, unknown>,
    res: Response<IVault>,
): Promise<void> {
    const user = req.user;
    if (!user.vault)
        throw new ServerError(
            "Vault doesn't exsist, please create a new vault",
            StatusCodes.NOT_FOUND,
        );

    const vault = req.body;
    if (!vault) {
        throw new ServerError("Vault is required", StatusCodes.BAD_REQUEST);
    }

    user.vault = vault;
    await user.save();

    res.status(StatusCodes.OK).json(user.vault);
}

export async function updateVault(
    req: AuthenticatedRequest<unknown, unknown, Partial<IVault>, unknown>,
    res: Response<IVault>,
): Promise<void> {
    const user = req.user;
    if (!user.vault)
        throw new ServerError(
            "Vault doesn't exsist, please create a new vault",
            StatusCodes.NOT_FOUND,
        );

    const vault = req.body;
    if (!vault) {
        throw new ServerError("Vault is required", StatusCodes.BAD_REQUEST);
    }

    user.vault = { ...user.vault, ...vault };
    await user.save();

    res.status(StatusCodes.OK).json(user.vault);
}

export async function createVaultItem(
    req: AuthenticatedRequest<unknown, unknown, IVaultItem, unknown>,
    res: Response<IVaultItem>,
) {
    const item = req.body;
    if (!item || !item.id || !item.ciphertext || !item.nonce)
        throw new ServerError("Invalid vault item", StatusCodes.BAD_REQUEST);

    const index = req.user.vault.items.findIndex((i) => i.id === item.id);
    if (index !== -1)
        throw new ServerError(
            "Vault item already exists",
            StatusCodes.CONFLICT,
        );

    req.user.vault.items.push(item);
    await req.user.save();

    res.status(StatusCodes.CREATED).json(item);
}

export async function getVaultItem(
    req: AuthenticatedRequest<{ id: string }, unknown, IVaultItem, unknown>,
    res: Response<IVaultItem>,
) {
    const id = req.params.id;
    if (!id)
        throw new ServerError("Invalid vault item id", StatusCodes.BAD_REQUEST);

    const item = req.user.vault.items.find((i) => i.id === id);
    if (!item)
        throw new ServerError("Vault item not found", StatusCodes.NOT_FOUND);

    res.status(StatusCodes.OK).json(item);
}

export async function replaceVaultItem(
    req: AuthenticatedRequest<{ id: string }, unknown, IVaultItem, unknown>,
    res: Response<IVaultItem>,
) {
    const item = req.body;
    if (!item || !item.id || !item.ciphertext || !item.nonce)
        throw new ServerError("Invalid vault item", StatusCodes.BAD_REQUEST);

    const index = req.user.vault.items.findIndex((i) => i.id === item.id);
    if (index === -1)
        throw new ServerError("Vault item not found", StatusCodes.NOT_FOUND);

    req.user.vault.items[index] = item;
    await req.user.save();

    res.status(StatusCodes.CREATED).json(item);
}

export async function deleteVaultItem(
    req: AuthenticatedRequest<{ id: string }, unknown, IVaultItem, unknown>,
    res: Response,
) {
    const item = req.body;
    if (!item || !item.id || !item.ciphertext || !item.nonce)
        throw new ServerError("Invalid vault item", StatusCodes.BAD_REQUEST);

    const index = req.user.vault.items.findIndex((i) => i.id === item.id);
    if (index === -1)
        throw new ServerError("Vault item not found", StatusCodes.NOT_FOUND);

    req.user.vault.items.splice(index, 1);
    await req.user.save();

    res.status(StatusCodes.NO_CONTENT).end();
}
