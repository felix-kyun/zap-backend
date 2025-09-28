import { loginFinish, loginStart } from "@controllers/login.controller.js";
import { Router } from "express";

export const loginRouter: Router = Router();

loginRouter.post("/start", loginStart);
loginRouter.post("/finish", loginFinish);
