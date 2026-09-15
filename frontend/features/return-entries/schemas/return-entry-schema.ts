import { z } from "zod"

export const returnEntryItemSchema = z.object({
  purchase_entry_item_id: z.number().min(1, "Le produit est requis."),
  quantity: z.number().int().min(1, "La quantité doit être supérieure à 0."),
})

export const returnEntrySchema = z.object({
  purchase_entry_id: z.number().min(1, "L'entrée d'achat est requise."),
  remark: z.string().max(255).optional(),
  items: z.array(returnEntryItemSchema).min(1, "Ajoutez au moins un produit."),
})

export type ReturnEntrySchema = z.infer<typeof returnEntrySchema>
