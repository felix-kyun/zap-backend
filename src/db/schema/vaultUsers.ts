import {
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	primaryKey,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";
import { vaultsTable } from "./vaults.js";

export const vaultUserRoles = pgEnum("vault_user_roles", [
	"read",
	"write",
	"admin",
]);
export const vaultUsers = pgTable(
	"vault_users",
	{
		userId: uuid("user_id").references(() => usersTable.id, {
			onDelete: "cascade",
		}),
		vaultId: uuid("vault_id").references(() => vaultsTable.id, {
			onDelete: "cascade",
		}),
		role: vaultUserRoles("role").notNull().default("read"),
		key_envelop: text("key_envelop").notNull(),
		createdBy: uuid("created_by").references(() => usersTable.id, {
			onDelete: "set null",
		}),
		addedAt: timestamp("added_at").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.vaultId] })],
);
