import {
    createVault,
    createVaultItem,
    deleteVaultItem,
    getVault,
    getVaultItem,
    replaceVault,
    replaceVaultItem,
    // replaceVault,
    updateVault,
} from "@controllers/vault.controller.js";
import {
    asRequestHandler,
    authMiddleware,
} from "@middlewares/auth.middleware.js";
import { ensureVaultExistsMiddleware } from "@middlewares/ensureVaultExists.middleware.js";
import { Router } from "express";

export const vaultRouter: Router = Router();

vaultRouter.use(authMiddleware);
vaultRouter
    .route("/")
    .get(asRequestHandler(getVault))
    .post(asRequestHandler(createVault))
    .put(asRequestHandler(replaceVault))
    .patch(asRequestHandler(updateVault));

vaultRouter.use(ensureVaultExistsMiddleware);
vaultRouter.post("/items", asRequestHandler(createVaultItem));
vaultRouter
    .route("/items/:id")
    .get(asRequestHandler(getVaultItem))
    .put(asRequestHandler(replaceVaultItem))
    .delete(asRequestHandler(deleteVaultItem));
