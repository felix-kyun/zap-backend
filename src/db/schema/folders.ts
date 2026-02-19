import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { vaultsTable } from "@/db/schema/vaults.js";

export const foldersTable = pgTable("folders", {
	id: uuid("id").defaultRandom().primaryKey(),
	vaultId: uuid("vault_id")
		.references(() => vaultsTable.id, { onDelete: "cascade" })
		.primaryKey(),
	encryptedName: text("encrypted_name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
});
