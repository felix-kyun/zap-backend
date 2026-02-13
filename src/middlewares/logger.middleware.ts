import { logger } from "@logger";
import type { NextFunction, Request, Response } from "express";

export function loggerMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const startTime = process.hrtime.bigint();

	const log = {
		query: req.query,
		params: req.params,
		body: undefined as unknown,
	};

	res.on("finish", () => {
		const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000;

		if (req.headers["content-type"] === "application/json" && req.body)
			log.body = req.body;

		logger.info(
			{
				...log,
				ip: req.ip,
				headers: req.headers,
			},
			`${res.statusCode} ${duration.toFixed(2)}ms - ${req.method} ${req.originalUrl || req.url}`,
		);
	});

	res.on("close", () => {
		if (res.writableEnded) return;
		logger.warn("Request aborted by the client");
	});

	next();
}
