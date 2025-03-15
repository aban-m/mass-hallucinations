import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const creationExtraArgs = z.object({
  width: z.number().int().positive().min(150).max(2000).nullable(),
  height: z.number().int().positive().min(150).max(2000).nullable(),
});

export type CreationExtraArgs = z.infer<typeof creationExtraArgs>;

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  credit: integer("credit").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const creation = pgTable(
  "creation",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    isPublic: boolean("is_public").notNull().default(false),
    title: varchar("title", { length: 120 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    prompt: varchar("prompt", { length: 2048 }).notNull(),
    seed: integer("seed").notNull(),
    extraArgs: jsonb("extra_args").$type<CreationExtraArgs>().default({
      width: null,
      height: null,
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("creation_user_idx").on(table.userId),
    index("creation_is_public_idx").on(table.isPublic),
  ]
);

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey(),
    creationId: uuid("creation_id")
      .notNull()
      .references(() => creation.id),
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
            .references(() => user.id),
        creationId: uuid("creation_id")
            .notNull()
            .references(() => creation.id),
    },
    (table) => [
        index("user_access_user_idx").on(table.userId),
        index("user_access_creation_idx").on(table.creationId),
        unique("user_access_creation_user_unique").on(table.creationId, table.userId)
    ]
)