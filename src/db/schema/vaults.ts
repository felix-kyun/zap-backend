import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";

export const vaultsTable = pgTable("vaults", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.primaryKey(),
	revision: integer("revision").notNull().default(0),
	encryptedName: text("encrypted_name").notNull(),
	encryptedKey: text("encrypted_key").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
});
