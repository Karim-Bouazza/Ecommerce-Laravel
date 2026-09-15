import { z } from "zod"

export const adjustStockSchema = z.object({
  adjustment: z.number().int("La quantité doit être un nombre entier."),
  purchase_price: z.number().min(0, "Le prix d'achat doit être positif."),
})

export type AdjustStockSchema = z.infer<typeof adjustStockSchema>
