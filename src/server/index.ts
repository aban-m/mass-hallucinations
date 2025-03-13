import { db } from "@/lib/db";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { creation } from "@/lib/db/schema";
import { eq, or, and } from "drizzle-orm";
import { z } from "zod";

const getPrivateGalleryDto = z.object({
  ownerId: z.string().uuid(),
  visitorId: z.string().uuid().nullable(),
});
// infer type from the schema
type GetPrivateGalleryDto = z.infer<typeof getPrivateGalleryDto>;

export const appRouter = router({
  publicGallery: publicProcedure.query(async () => {
    const creations = await db
      .select()
      .from(creation)
      .where(eq(creation.isPublic, true))
      .limit(20);
    return creations;
  }),
  privateGallery: publicProcedure
    .input(getPrivateGalleryDto)
    .query(async ({ input: { visitorId, ownerId } }) => {
      const creations = await db
        .select()
        .from(creation)
        .where(
            and(
              eq(creation.userId, ownerId),
              visitorId
                ? or(eq(creation.isPublic, true), eq(creation.userId, visitorId))
                : eq(creation.isPublic, true)
            )
          )
        .limit(20);
      return creations;
    }),
});

export type AppRouter = typeof appRouter;
