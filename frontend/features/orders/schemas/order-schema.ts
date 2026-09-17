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
    provider_wilaya_id: z.number().nullable(),
    provider_commune_id: z.number().nullable(),
    delivery_type: z.enum(["express", "point_relais"]),
    provider_office_id: z.string().nullable(),
    delivery_price: z.number().min(0).optional(),
    delivery_note: z.string().max(1000).optional(),
    name: z.string().max(255).optional(),
    provider_order_id: z.string().max(255).optional(),
    free_delivery: z.boolean(),
    can_be_opened: z.boolean(),
    items: z.array(orderItemSchema).min(1, "Ajoutez au moins un produit."),
  })
  .refine((data) => data.wilaya_id !== null, {
    message: "La wilaya est requise.",
    path: ["wilaya_id"],
  })
  .refine((data) => data.delivery_type !== "point_relais" || data.provider_office_id !== null, {
    message: "Sélectionnez un stop desk.",
    path: ["provider_office_id"],
  })

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
