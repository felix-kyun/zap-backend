import { ENV, POSTGRES_URI } from "@config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema/index.js";

export type DB = ReturnType<typeof drizzle<typeof schema>>;
export const db = drizzle(POSTGRES_URI, {
	schema,
	logger: ENV != "production",
});
