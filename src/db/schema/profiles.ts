import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";

export const profilesTable = pgTable("profiles", {
	userId: uuid("user_id")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.primaryKey(),
	name: text("name").notNull(),
	avatarUrl: text("avatar_url").notNull(),
});
