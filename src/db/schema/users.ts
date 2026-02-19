import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
});
