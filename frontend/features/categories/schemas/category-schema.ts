import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  is_active: z.boolean(),
})

export type CategorySchema = z.infer<typeof categorySchema>
