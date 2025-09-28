import {
    registerFinish,
    registerStart,
} from "@controllers/register.controller.js";
import { Router } from "express";

export const registerRouter: Router = Router();

registerRouter.post("/start", registerStart);
registerRouter.post("/finish", registerFinish);
