import { REDIS_URI } from "@config";
import { logger } from "@logger";
import type { RedisClientType } from "redis";
import { createClient } from "redis";

// separate into function just to stop ts from complaining
// about how createClient return is an error
function createRedisClient(): RedisClientType {
	return createClient({
		url: REDIS_URI,
	});
}

export const redis: RedisClientType = createRedisClient();

redis.on("error", (err) => {
	logger.error(err, "Redis Client Error");
});

redis.on("ready", () => {
	logger.info("Redis client connected");
});

export async function connectRedis(): Promise<void> {
	try {
		await redis.connect();
	} catch (error: unknown) {
		logger.fatal("Failed to connect to Redis");
		logger.fatal(error);
		process.exit(1);
	}
}
