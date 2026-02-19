import { pgTable, uuid, text, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";

export const authType = pgEnum("auth_type", ["email", "google"]);

export const authTable = pgTable("auth", {
	userId: uuid("user_id")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.primaryKey(),
	type: authType("auth_type").notNull(),
	data: text("data").notNull(),
});
