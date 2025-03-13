import { relations } from "drizzle-orm";
import { user, creation, votes } from "./schema";

export const userRelations = relations(user, ({ many }) => ({
    creations: many(creation),
    votes: many(votes)
}));

export const creationRelations = relations(creation, ({ one, many }) => ({
    user: one(user, {
        fields: [creation.userId],
        references: [user.id]
    }),
    votes: many(votes)
}));

export const votesRelations = relations(votes, ({ one }) => ({
    user: one(user, {
        fields: [votes.userId],
        references: [user.id]
    }),
    creation: one(creation, {
        fields: [votes.creationId],
        references: [creation.id]
    })
}));