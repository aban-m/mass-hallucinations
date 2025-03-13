import { boolean, index, integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export interface CreationExtraArgs {
    width?: number,
    height?: number
}

export const user = pgTable("user", {
    id: uuid("id").primaryKey(),
    email: varchar("email", {length: 256}).notNull().unique(),
    name: varchar("name", {length: 256}).notNull(),
    isAdmin: boolean("is_admin").notNull().default(false),
    credit: integer("credit").notNull().default(50),
    canAccess: jsonb("can_access").$type<{ids: string[]}>().default({ids: []}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
})

export const creation = pgTable("creation", {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => user.id),
    isPublic: boolean("is_public").notNull().default(false),
    title: varchar("title", {length: 120}).notNull(),
    description: varchar("description", {length: 500}).notNull(),
    prompt: varchar("prompt", {length: 2048}).notNull(),
    seed: integer("seed").notNull(),
    extraArgs: jsonb("extra_args").$type<CreationExtraArgs>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow()
}, (table) => [
    index("creation_user_idx").on(table.userId)
])

export const votes = pgTable("votes", {
    id: uuid("id").primaryKey(),
    creationId: uuid("creation_id").notNull().references(() => creation.id),
    userId: uuid("user_id").notNull().references(() => user.id),
    vote: integer("vote").notNull()
}, (table) => [
    index("vote_creation_idx").on(table.creationId),
    index("vote_user_idx").on(table.userId)
])
