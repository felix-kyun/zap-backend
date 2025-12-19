import { getVault, updateVault } from "@controllers/vault.controller.js";
import { verifyTokenMiddleware } from "@middlewares/verifyToken.middleware.js";
import { Router } from "express";

export const vaultRouter: Router = Router();

vaultRouter.use(verifyTokenMiddleware);

vaultRouter.post("/", getVault);
vaultRouter.put("/sync", updateVault);
