import { z } from "zod"
import { MAX_ORDER_QUANTITY } from "./product-data"

export function createCodOrderSchema(requireVariant: boolean) {
  return z
    .object({
      first_name: z.string().trim().min(2, "Le prénom est requis."),
      last_name: z.string().trim().min(2, "Le nom est requis."),
      phone_number: z
        .string()
        .trim()
        .regex(/^0[567]\d{8}$/, "Numéro invalide (ex : 0550 12 34 56)."),
      provider_wilaya_id: z.number().nullable(),
      wilaya_id: z.number().nullable(),
      provider_commune_id: z.number().nullable(),
      delivery_type: z.enum(["home", "stopdesk"]),
      variant_id: z.number().nullable(),
      quantity: z.number().int().min(1).max(MAX_ORDER_QUANTITY),
    })
    .refine((data) => data.provider_wilaya_id !== null, {
      message: "La wilaya est requise.",
      path: ["provider_wilaya_id"],
    })
    .refine((data) => data.provider_wilaya_id === null || data.wilaya_id !== null, {
      message: "Wilaya introuvable, veuillez en choisir une autre.",
      path: ["provider_wilaya_id"],
    })
    .refine((data) => data.provider_commune_id !== null, {
      message: "La commune est requise.",
      path: ["provider_commune_id"],
    })
    .refine((data) => !requireVariant || data.variant_id !== null, {
      message: "Choisissez une option.",
      path: ["variant_id"],
    })
}

export type CodOrderSchema = z.infer<ReturnType<typeof createCodOrderSchema>>
