import { ENV } from "@config";
import { ServerError } from "@errors/ServerError.error.js";
import { logger } from "@logger";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

type KnownError = "CastError" | "MongoServerError";
interface IErrorResponse {
    code: number;
    message: string;
}

// Either a static response or a function that returns a response based on the error
// function can return void if it doesn't want to handle the error
type ErrorResponse =
    | IErrorResponse
    | { fn: (err: Error) => IErrorResponse | void };

const errorMap: Record<KnownError, ErrorResponse> = {
    CastError: {
        code: StatusCodes.BAD_REQUEST,
        message: "Invalid ID format",
    },
    MongoServerError: {
        fn: (err: Error) => {
            if ("code" in err && err.code === 11000) {
                return {
                    code: StatusCodes.CONFLICT,
                    message: "Duplicate key error",
                };
            }
        },
    },
};

export function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    if (isKnownError(error.name)) {
        const handler = errorMap[error.name];

        // handler with fn
        if ("fn" in handler) {
            const result = handler.fn(error);
            if (result) {
                res.status(result.code).json({
                    error: error.name,
                    message: result.message,
                });
                return;
            }
        } else {
            // static handler
            res.status(handler.code).json({
                error: error.name,
                message: handler.message,
            });
        }
    } else if (error instanceof ServerError) {
        res.status(error.statusCode).json({
            error: error.name,
            message: error.message,
        });
        return;
    }

    logger.error(error, "Unhandled error");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.name,
        message:
            ENV === "production"
                ? "Internal Server Error"
                : (error.message ?? "Internal Server Error"),
    });
}

function isKnownError(name: string): name is KnownError {
    return name in errorMap;
}
