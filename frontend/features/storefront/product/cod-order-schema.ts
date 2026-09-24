import { z } from "zod"
import { MAX_ORDER_QUANTITY } from "./product-data"

export const codOrderSchema = z
  .object({
    full_name: z.string().trim().min(3, "Le nom complet est requis."),
    phone_number: z
      .string()
      .trim()
      .regex(/^0[567]\d{8}$/, "Numéro invalide (ex : 0550 12 34 56)."),
    wilaya_id: z.number().nullable(),
    commune: z.string().trim().min(2, "La commune est requise."),
    address: z.string().trim().max(500).optional(),
    delivery_type: z.enum(["home", "stopdesk"]),
    quantity: z.number().int().min(1).max(MAX_ORDER_QUANTITY),
    note: z.string().trim().max(500).optional(),
  })
  .refine((data) => data.wilaya_id !== null, {
    message: "La wilaya est requise.",
    path: ["wilaya_id"],
  })

export type CodOrderSchema = z.infer<typeof codOrderSchema>
