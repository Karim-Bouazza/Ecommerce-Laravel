import { z } from "zod"

export const roleSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  permissions: z.array(z.string()),
})

export type RoleSchema = z.infer<typeof roleSchema>
