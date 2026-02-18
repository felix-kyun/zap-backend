import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const newUsersTable = pgTable("new_users", {
	id: uuid("id")
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	email: text("email").notNull().unique(),
	otp: text("otp").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
