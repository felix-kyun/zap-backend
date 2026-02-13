import { StatusCodes } from "http-status-codes";

export class ServerError extends Error {
	public statusCode: number;
	// public info?: Record<string, unknown>;

	constructor(
		message: string,
		statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.statusCode = statusCode;
		this.name = "ServerError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
