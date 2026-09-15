import { z } from "zod"

export const versementSchema = z
  .object({
    date: z.date(),
    wallet_id: z.number().nullable(),
    fournisseur_id: z.number().nullable(),
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
  .refine((data) => data.fournisseur_id !== null, {
    message: "Le fournisseur est requis.",
    path: ["fournisseur_id"],
  })

export type VersementSchema = z.infer<typeof versementSchema>
