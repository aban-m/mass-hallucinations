import { relations } from "drizzle-orm";
import { user, creation, vote } from "./schema";

export const userRelations = relations(user, ({ many }) => ({
    creations: many(creation),
    vote: many(vote)
}));

export const creationRelations = relations(creation, ({ one, many }) => ({
    user: one(user, {
        fields: [creation.userId],
        references: [user.id]
    }),
    vote: many(vote)
}));

export const voteRelations = relations(vote, ({ one }) => ({
    user: one(user, {
        fields: [vote.userId],
        references: [user.id]
    }),
    creation: one(creation, {
        fields: [vote.creationId],
        references: [creation.id]
    })
}));