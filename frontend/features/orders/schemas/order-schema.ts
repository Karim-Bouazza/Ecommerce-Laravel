import { z } from "zod"

export const orderItemSchema = z.object({
  id: z.number().optional(),
  warehouse_id: z.number().min(1, "L'entrepôt est requis."),
  product_id: z.number().min(1, "Le produit est requis."),
  variant: z.string().max(255).optional(),
  quantity: z.number().int().min(1, "La quantité doit être supérieure à 0."),
  unit_price: z.number().min(0).optional(),
})

export const createOrderSchema = z
  .object({
    first_name: z.string().min(1, "Le prénom est requis.").max(255),
    last_name: z.string().min(1, "Le nom est requis.").max(255),
    phone_number: z.string().min(1, "Le téléphone est requis.").max(255),
    wilaya_id: z.number().nullable(),
    commune_id: z.number().nullable(),
    address: z.string().max(1000).optional(),
    delivery_type: z.enum(["domicile", "stop_desk"]),
    stop_desk_company_id: z.number().nullable(),
    delivery_price: z.number().min(0).optional(),
    delivery_note: z.string().max(1000).optional(),
    items: z.array(orderItemSchema).min(1, "Ajoutez au moins un produit."),
  })
  .refine((data) => data.wilaya_id !== null, {
    message: "La wilaya est requise.",
    path: ["wilaya_id"],
  })
  .refine((data) => data.commune_id !== null, {
    message: "La commune est requise.",
    path: ["commune_id"],
  })
  .refine((data) => data.delivery_type !== "stop_desk" || data.stop_desk_company_id !== null, {
    message: "Sélectionnez une société stop desk.",
    path: ["stop_desk_company_id"],
  })

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
