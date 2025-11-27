import { ServerError } from "@errors/ServerError.error.js";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends ServerError {
    constructor(message?: string) {
        super(message ?? "invalid or missing fields", StatusCodes.BAD_REQUEST);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
