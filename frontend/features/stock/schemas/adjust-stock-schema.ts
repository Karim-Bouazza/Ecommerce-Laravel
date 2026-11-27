import { z } from "zod"

export const adjustStockSchema = z.object({
  adjustment: z.number().int("La quantité doit être un nombre entier."),
})

export type AdjustStockSchema = z.infer<typeof adjustStockSchema>
