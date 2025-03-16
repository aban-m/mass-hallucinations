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

const getPrivateGalleryDto = z.object({
  ownerId: z.string().uuid(),
});
// infer type from the schema
export type GetPrivateGalleryDto = z.infer<typeof getPrivateGalleryDto>;

const generateImageDto = z.object({
  prompt: z.string().min(5).max(4096),
  seed: z.number().int().nullable().default(1),
  extraArgs: creationExtraArgs.default({
    width: 360,
    height: 540,
  }),
});

export type GenerateImageDto = z.infer<typeof generateImageDto>;

export const appRouter = router({
  publicGallery: publicProcedure.query(async () => {
    return db
      .select()
      .from(creationTable)
      .where(eq(creationTable.isPublic, true));
  }),

  resolveUUID: publicProcedure
    .input(z.string().email())
    .query(async ({ input: email }) => {
      const userRecord = await getUser(email)
      return userRecord ? {'uuid': userRecord.id} : {'uuid': null}
    }),

  privateGallery: authedProcedure
    .input(getPrivateGalleryDto)
    .query(async ({ input: { ownerId }, ctx }) => {
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
    .mutation(async ({ input: { prompt, seed, extraArgs }, ctx: { user } }) => {
      const credit = (await getUser(user.email)).credit!
      if (credit < 10) {
        throw new Error("Not enough credit");
      }
      await db.insert(creationTable).values({
        id: randomUUID().toString(),
        userId: user!.id,
        prompt: prompt,
        description: "",
        title: "",
        seed: seed ?? 0,
      });

      await db
        .update(userTable)
        .set({ credit: credit - 10 })
        .where(eq(userTable.id, user!.id));
      return fetchImage(null, prompt);
    }),

  listUsers: adminProcedure.query(async () => {
    return db.select().from(userTable);
  }),
});

export type AppRouter = typeof appRouter;
