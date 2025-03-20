import { db } from "@/lib/db";
import {
  router,
  adminProcedure,
  authedProcedure,
  protectedProcedure,
  publicProcedure,
} from "./trpc";
import {
  Creation,
  creation as creationTable,
  User,
  userAccess,
  user as userTable,
} from "@/lib/db/schema";
import { serverPolicy } from "@/lib/common/config";
import { eq, or, and } from "drizzle-orm";
import { z } from "zod";
import { fetchImage } from "@/lib/storage";
import { randomUUID } from "crypto";
import {
  canAccess,
  commitImage,
  getCreationByUUID,
  getPublicGallery,
  getUserGallery,
} from "@/lib/db/queries";

import * as dtos from "@/lib/common/dtos";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  piece: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input: imageUUID, ctx: { user } }) => {
      const creation = await getCreationByUUID(imageUUID);
      if (!creation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (!canAccess(user, creation!)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return creation;
    }),

  gallery: authedProcedure
    .input(dtos.getGalleryDto)
    .query(async ({ input : {which}, ctx: { user } }): Promise<dtos.GalleryDto> => {
      if (!user && which === 'MINE') {
        throw new TRPCError({code: "UNAUTHORIZED"})
      }
      if (which === 'MINE') throw new TRPCError({code: "INTERNAL_SERVER_ERROR"}) // TODO: Implement this
      const result = await getPublicGallery()
      return result
    }),

  userGallery: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input: userUUID, ctx : {user: visitor} }) => {
      const result = await getUserGallery(userUUID, visitor)
      return result
    }),

  commitImage: protectedProcedure
    .input(dtos.commitImageDto)
    .mutation(async ({ input: data, ctx: { user } }) => {
      const result = fetchImage({data});
      await commitImage(user!.id, data);
      return fetchImage({data});
    }),

  generateImage: (serverPolicy.GUESTS_CAN_GENERATE
    ? publicProcedure
    : protectedProcedure
  )
    .input(dtos.generateImageDto)
    .mutation(async ({ input: data }) => {
      return fetchImage({data});
    }),

  listUsers: adminProcedure.query(async () => {
    return db.select().from(userTable);
  }),
});

export type AppRouter = typeof appRouter;
