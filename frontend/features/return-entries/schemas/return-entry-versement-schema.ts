import { z } from "zod"

export const returnEntryVersementSchema = z
  .object({
    date: z.date(),
    wallet_id: z.number().nullable(),
    remark: z.string().max(255).optional(),
  })
  .refine((data) => data.wallet_id !== null, { message: "Le portefeuille est requis.", path: ["wallet_id"] })

export type ReturnEntryVersementSchema = z.infer<typeof returnEntryVersementSchema>
