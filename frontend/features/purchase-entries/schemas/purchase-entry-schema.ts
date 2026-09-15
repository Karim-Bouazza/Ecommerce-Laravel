import { z } from "zod"

export const purchaseEntryItemSchema = z.object({
  product_id: z.number().min(1, "Le produit est requis."),
  quantity: z.number().int().min(1, "La quantité doit être supérieure à 0."),
  purchase_price: z.number().min(0, "Le prix d'achat doit être positif."),
})

export const purchaseEntrySchema = z.object({
  warehouse_id: z.number().min(1, "L'entrepôt est requis."),
  fournisseur_id: z.number().min(1, "Le fournisseur est requis."),
  remark: z.string().max(255).optional(),
  items: z.array(purchaseEntryItemSchema).min(1, "Ajoutez au moins un produit."),
})

export type PurchaseEntrySchema = z.infer<typeof purchaseEntrySchema>
