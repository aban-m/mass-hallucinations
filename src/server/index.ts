import { db } from "@/lib/db";
import {
  router,
  adminProcedure,
  authedProcedure,
  protectedProcedure,
  publicProcedure,
} from "./trpc";
import { creation as creationTable, user as userTable } from "@/lib/db/schema";
import { serverPolicy } from "@/lib/common/config";
import { eq, or, and } from "drizzle-orm";
import { z } from "zod";
import { fetchImage } from "@/lib/storage";
import { randomUUID } from "crypto";
import { canAccess, commitImage, getCreationByUUID, getUserByEmail } from "@/lib/db/queries";

import * as dtos from "@/lib/common/dtos";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  piece: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input: imageUUID, ctx: { user } }) => {
      const creation = await getCreationByUUID(imageUUID)
      if (!creation) { throw new TRPCError({code: "NOT_FOUND"})}
      if (!canAccess(user, creation!)) { throw new TRPCError({code: "FORBIDDEN"})}
      return creation
    }),
  gallery: authedProcedure
    .input(dtos.galleryDto)
    .query(async ({ input, ctx: { user } }) => {
      let fromUsers = input.fromUsers.concat(input.mine && user ? user.id : []);
      const results = db
        .select()
        .from(creationTable)
        .where(
          input.public
            ? eq(creationTable.isPublic, true)
            : and(
                or(...fromUsers.map((uuid) => eq(creationTable.userId, uuid)))
              )
        );
      return results;
    }),

  resolveUser: publicProcedure
    .input(z.string().email())
    .query(async ({ input: email }) => {
      const userRecord = await getUserByEmail(email);
      return userRecord ? { uuid: userRecord.id } : { uuid: null };
    }),

  commitImage: protectedProcedure
    .input(dtos.commitImageDto)
    .mutation(async ({ input, ctx: { user } }) => {
      const result = fetchImage(null, input.prompt);
      await commitImage(user.id, input);
      return fetchImage(null, input.prompt);
    }),

  generateImage: (serverPolicy.GUESTS_CAN_GENERATE
    ? publicProcedure
    : protectedProcedure
  )
    .input(dtos.generateImageDto)
    .mutation(async ({ input: { prompt } }) => {
      return fetchImage(null, prompt);
    }),

  listUsers: adminProcedure.query(async () => {
    return db.select().from(userTable);
  }),
});

export type AppRouter = typeof appRouter;
