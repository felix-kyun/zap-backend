import {
    AuthStatus,
    getCurrentUser,
    logout,
    refresh,
} from "@controllers/auth.controller.js";
import { Router } from "express";

export const authRouter: Router = Router();

authRouter.post("/logout", logout);
authRouter.post("/refresh", refresh);
authRouter.post("/status", AuthStatus);
authRouter.post("/me", getCurrentUser);
