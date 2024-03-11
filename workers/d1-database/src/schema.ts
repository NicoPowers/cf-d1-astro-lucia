import { sql } from "drizzle-orm"
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  username: text("username").unique().notNull().default("NULL"),
  hashedPassword: text("hashed_password"),
})

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .default("NULL"),
})