import { z } from "zod"

export const paiementSchema = z
  .object({
    date: z.date(),
    wallet_id: z.number().nullable(),
    delivery_company_integration_id: z.number().nullable(),
    amount: z
      .string()
      .min(1, "Le montant est requis.")
      .refine((value) => Number(value) > 0, "Le montant doit être supérieur à 0."),
    remark: z.string().max(255).optional(),
  })
  .refine((data) => data.wallet_id !== null, {
    message: "Le portefeuille est requis.",
    path: ["wallet_id"],
  })
  .refine((data) => data.delivery_company_integration_id !== null, {
    message: "Le partenaire de livraison est requis.",
    path: ["delivery_company_integration_id"],
  })

export type PaiementSchema = z.infer<typeof paiementSchema>
