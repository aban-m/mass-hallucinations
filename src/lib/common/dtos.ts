import { z } from "zod";
import { creation as creationTable, User, user as userTable } from '@/lib/db/schema'
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// #region "Pagination"
export const paginationDto = z.object({
  count: z.number().int().positive()
})
export type PaginationDto = z.infer<typeof paginationDto>

const PaginatedData = <T extends z.ZodTypeAny>(data: T) => 
  z.object({
    pagination: paginationDto,
    data
  })

  // #endregion

// #region "Common Types"
export const creationSchema = createSelectSchema(creationTable)
export const userSchema = createSelectSchema(userTable)
export const safeUser = createSelectSchema(userTable).pick({id: true, isAdmin: true, username: true, name: true})
export type SafeUser = z.infer<typeof safeUser>;
// #endregion


export const getGalleryDto = z.object({
  which: z.enum(['PUBLIC', 'MINE'])
});

export type GetGalleryDto = z.infer<typeof getGalleryDto>;

const _galleryDto = z.array(z.object({
  user: safeUser,
  creation: creationSchema
}))
export const galleryDto = PaginatedData(_galleryDto)
export type GalleryDto = z.infer<typeof galleryDto>;

export const userGalleryDto = z.object({
  user: safeUser,
  creations: PaginatedData(
    z.array(creationSchema)
  )
})
export type UserGalleryDto = z.infer<typeof userGalleryDto>;

export const commitImageDto = createInsertSchema(creationTable, {
  seed: (schema) => schema.default(1),
}).omit({ createdAt: true, userId: true, id: true });
export type CommitImageDto = z.infer<typeof commitImageDto>;

export const generateImageDto = commitImageDto.omit({title: true, description: true, isPublic: true})
export type GenerateImageDto = z.infer<typeof generateImageDto>;