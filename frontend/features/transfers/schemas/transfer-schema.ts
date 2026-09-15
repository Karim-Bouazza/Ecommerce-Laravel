import { z } from "zod"

export const transferItemSchema = z.object({
  product_id: z.number().min(1, "Le produit est requis."),
  quantity: z.number().int().min(1, "La quantité doit être supérieure à 0."),
})

export const transferSchema = z
  .object({
    from_warehouse_id: z.number().min(1, "L'entrepôt source est requis."),
    to_warehouse_id: z.number().min(1, "L'entrepôt de destination est requis."),
    remark: z.string().max(255).optional(),
    items: z.array(transferItemSchema).min(1, "Ajoutez au moins un produit."),
  })
  .refine((data) => data.from_warehouse_id !== data.to_warehouse_id, {
    message: "L'entrepôt de destination doit être différent de l'entrepôt source.",
    path: ["to_warehouse_id"],
  })

export type TransferSchema = z.infer<typeof transferSchema>
