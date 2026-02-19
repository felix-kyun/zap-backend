import {
	pgTable,
	uuid,
	text,
	timestamp,
	inet,
	pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "@/db/schema/users.js";

export const clientType = pgEnum("client_type", ["web", "mobile", "cli"]);
export const revokeReason = pgEnum("revoke_reason", [
	"logout",
	"logout_all",
	"token_expire",
]);
export const sessionsTable = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => usersTable.id, { onDelete: "cascade" })
		.primaryKey(),
	hash: text("hash").notNull(),
	type: clientType("type").notNull(),
	userAgent: text("user_agent").notNull(),
	ipAddress: inet("ip_address").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	expiresAt: timestamp("expires_at").notNull(),
	lastActiveAt: timestamp("last_active_at").notNull().defaultNow(),
	revokedAt: timestamp("revoked_at"),
	revokedReason: revokeReason("revoked_reason"),
});
