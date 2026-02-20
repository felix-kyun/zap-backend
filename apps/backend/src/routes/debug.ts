import type { Request, Response } from "express";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import {
	ENV,
	JWT_SECRET,
	LOG_LEVEL,
	LOGFILE,
	MONGO_URI,
} from "@/utils/config/config.js";

export const debugRouter: Router = Router();

debugRouter.get("/vars", (_req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({
		ENV,
		LOG_LEVEL,
		LOGFILE,
		JWT_SECRET,
		MONGO_URI,
	});
});
