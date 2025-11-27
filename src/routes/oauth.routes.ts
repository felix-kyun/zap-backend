import { googleLogin } from "@controllers/oauth.controller.js";
import { Router } from "express";

export const oauthRouter: Router = Router();

oauthRouter.post("/google", googleLogin);
