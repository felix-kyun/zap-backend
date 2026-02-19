import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";

export const keysTable = pgTable("keys", {
	userId: uuid("user_id")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.primaryKey(),
	publicKey: text("public_key").notNull(),
	encryptedPrivateKey: text("encrypted_private_key").notNull(),
});
