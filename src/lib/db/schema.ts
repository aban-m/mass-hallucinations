import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  PgUpdateDynamic,
  timestamp,
  unique,
  UpdateDeleteAction,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { creationRelations, userRelations, voteRelations } from "./relations";

const alwaysCascade = {
  onDelete: "cascade" as UpdateDeleteAction,
  onUpdate: "cascade" as UpdateDeleteAction,
};

export const creationExtraArgs = z.object({
  width: z.number().int().positive().min(150).max(2000),
  height: z.number().int().positive().min(150).max(2000),
});

export type CreationExtraArgs = z.infer<typeof creationExtraArgs>;

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    username: varchar("username", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    isAdmin: boolean("is_admin").notNull().default(false),
    credit: integer("credit").notNull().default(50),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("creation_username_idx").on(table.username)]
);

export const creation = pgTable(
  "creation",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, alwaysCascade),
    isPublic: boolean("is_public").notNull().default(false),
    title: varchar("title", { length: 120 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    prompt: varchar("prompt", { length: 2048 }).notNull(),
    seed: integer("seed").notNull(),
    extraArgs: jsonb("extra_args").$type<CreationExtraArgs>(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("creation_user_idx").on(table.userId),
    index("creation_is_public_idx").on(table.isPublic),
  ]
);

export const vote = pgTable(
  "vote",
  {
    id: uuid("id").primaryKey(),
    creationId: uuid("creation_id")
      .notNull()
      .references(() => creation.id, alwaysCascade),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    vote: integer("vote").notNull(),
  },
  (table) => [
    index("vote_creation_idx").on(table.creationId),
    index("vote_user_idx").on(table.userId),
    unique("vote_creation_user_unique").on(table.creationId, table.userId),
  ]
);

export const userAccess = pgTable(
  "user_access",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, alwaysCascade),
    creationId: uuid("creation_id")
      .notNull()
      .references(() => creation.id, alwaysCascade),
  },
  (table) => [
    index("user_access_user_idx").on(table.userId),
    index("user_access_creation_idx").on(table.creationId),
    unique("user_access_creation_user_unique").on(
      table.creationId,
      table.userId
    ),
  ]
);

export type User = typeof user.$inferSelect;
export type Creation = typeof creation.$inferSelect;
export type Vote = typeof vote.$inferSelect;
