import { z } from "zod"

export const tagSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
})

export type TagSchema = z.infer<typeof tagSchema>
