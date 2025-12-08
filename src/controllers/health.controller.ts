import { redis } from "@utils/database/redis.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";

type Status = "ok" | "error";
type HealthCheckResponse = {
    status: Status;
    uptime: number;
    timestamp: string;
    db: Array<{ name: string; status: Status }>;
};

export async function healthCheck(
    _req: Request,
    res: Response<HealthCheckResponse>,
): Promise<void> {
    const db: HealthCheckResponse["db"] = [];

    // mongo
    try {
        if (mongoose.connection.readyState === 1) {
            db.push({ name: "mongo", status: "ok" });
        } else throw new Error("MongoDB not connected");
    } catch {
        db.push({ name: "mongo", status: "error" });
    }

    // redis
    try {
        if ((await redis.ping()) === "PONG") {
            db.push({ name: "redis", status: "ok" });
        } else throw new Error("Redis not connected");
    } catch {
        db.push({ name: "redis", status: "error" });
    }

    const status: Status = db.every((e) => e.status === "ok") ? "ok" : "error";
    const statusCode: number = status === "ok" ? 200 : 500;

    res.status(statusCode).json({
        status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        db,
    });
}
