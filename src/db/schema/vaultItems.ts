import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { vaultsTable } from "@/db/schema/vaults.js";
import { foldersTable } from "@/db/schema/folders.js";
import { usersTable } from "./users.js";

export const vaultItemType = pgEnum("vault_item_type", [
	"login",
	"card",
	"identity",
	"note",
	"totp",
	"file",
]);
export const vaultItemsTable = pgTable("vault_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	vaultId: uuid("vault_id")
		.references(() => vaultsTable.id, { onDelete: "cascade" })
		.notNull(),
	folderId: uuid("folder_id").references(() => foldersTable.id, {
		onDelete: "set null",
	}),
	revision: integer("revision").notNull().default(0),
	type: vaultItemType("type").notNull(),
	encryptedName: text("encrypted_name").notNull(),
	encryptedDescription: text("encrypted_description"),
	favorite: boolean("favorite").notNull().default(false),
	encryptedData: text("encrypted_data").notNull(),
	createdBy: uuid("created_by")
		.references(() => usersTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	deletedAt: timestamp("deleted_at"),
});
