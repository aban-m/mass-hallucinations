import { db } from "@/lib/db";
import {
  router,
  adminProcedure,
  authedProcedure,
  protectedProcedure,
  publicProcedure,
} from "./trpc";
import {
  creation as creationTable,
  user as userTable,
  creationExtraArgs,
} from "@/lib/db/schema";
import { eq, or, and } from "drizzle-orm";
import { z } from "zod";
import { fetchImage } from "@/lib/storage";
import { randomUUID } from "crypto";
import { getUser } from "@/lib/db/queries";

import { createInsertSchema } from "drizzle-zod";

const galleryDto = z.object({
  public: z.boolean(),
  fromUsers: z.array(z.string().uuid()).optional().default([]),
  mine: z.boolean(),
});

export type GalleryDto = z.infer<typeof galleryDto>

const generateImageDto = createInsertSchema(creationTable, {
  seed: (schema) => schema.default(1),
}).omit({ createdAt: true, userId: true, id: true });

export type GenerateImageDto = z.infer<typeof generateImageDto>;

export const appRouter = router({
  gallery: authedProcedure.input(galleryDto).query(async ({input, ctx: {user}}) => {
    let fromUsers = input.fromUsers.concat((input.mine && user) ? user.id : [])
    return db
      .select()
      .from(creationTable)
      .where(
        input.public ? (
          eq(creationTable.isPublic, true)
        ) : (
          and(
            or(...fromUsers.map((uuid) => eq(creationTable.userId, uuid)))
          )
        )
      )
  }),

  publicGallery: publicProcedure.query(async () => {
    return db
      .select()
      .from(creationTable)
      .where(eq(creationTable.isPublic, true));
  }),

  resolveUUID: publicProcedure
    .input(z.string().email())
    .query(async ({ input: email }) => {
      const userRecord = await getUser(email);
      return userRecord ? { uuid: userRecord.id } : { uuid: null };
    }),

  privateGallery: authedProcedure
    .input(z.string().uuid())
    .query(async ({ input: ownerId, ctx }) => {
      const visitor = ctx.user;
      console.log(visitor.id);
      let result = await db
        .select()
        .from(creationTable)
        .where(
          and(
            eq(creationTable.userId, ownerId),
            or(
              eq(creationTable.isPublic, true),
              visitor ? eq(creationTable.userId, visitor.id) : undefined
            )
          )
        );
      //.limit
      return result;
    }),

  generateImage: protectedProcedure
    .input(generateImageDto)
    .mutation(async ({ input, ctx: { user } }) => {
      const credit = (await getUser(user.email)).credit!;
      if (credit < 10) {
        throw new Error("Not enough credit");
      }

      await db
        .insert(creationTable)
        .values({ ...input, userId: user.id, id: randomUUID() });

      await db
        .update(userTable)
        .set({ credit: credit - 10 })
        .where(eq(userTable.id, user!.id));

      return fetchImage(null, input.prompt);
    }),

  listUsers: adminProcedure.query(async () => {
    return db.select().from(userTable);
  }),
});

export type AppRouter = typeof appRouter;
