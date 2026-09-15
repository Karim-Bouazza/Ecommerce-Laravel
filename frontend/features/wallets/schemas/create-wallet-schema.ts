import { z } from "zod"

export const createWalletSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  remark: z.string().max(255).optional(),
})

export type CreateWalletSchema = z.infer<typeof createWalletSchema>
