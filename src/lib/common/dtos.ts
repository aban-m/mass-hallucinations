import { z } from "zod";
import { creation as creationTable } from '@/lib/db/schema'
import { createInsertSchema } from "drizzle-zod";

export const galleryDto = z.object({
  public: z.boolean(),
  fromUsers: z.array(z.string().uuid()).optional().default([]),
  mine: z.boolean(),
});

export type GalleryDto = z.infer<typeof galleryDto>;

export const commitImageDto = createInsertSchema(creationTable, {
  seed: (schema) => schema.default(1),
}).omit({ createdAt: true, userId: true, id: true });

export type CommitImageDto = z.infer<typeof commitImageDto>;

export const generateImageDto = commitImageDto.omit({title: true, description: true, isPublic: true})
export type GenerateImageDto = z.infer<typeof generateImageDto>;