import { healthCheck } from "@controllers/health.controller.js";
import { Router } from "express";

export const healthCheckRouter: Router = Router();

healthCheckRouter.get("/", healthCheck);
