import { z } from "zod"

export const createTransferSchema = z
  .object({
    date: z.date(),
    from_wallet_id: z.number().nullable(),
    to_wallet_id: z.number().nullable(),
    amount: z
      .string()
      .min(1, "Le montant est requis.")
      .refine((value) => Number(value) > 0, "Le montant doit être supérieur à 0."),
    remark: z.string().max(255).optional(),
  })
  .refine((data) => data.from_wallet_id !== null, {
    message: "Le portefeuille source est requis.",
    path: ["from_wallet_id"],
  })
  .refine((data) => data.to_wallet_id !== null, {
    message: "Le portefeuille destination est requis.",
    path: ["to_wallet_id"],
  })
  .refine((data) => data.from_wallet_id === null || data.from_wallet_id !== data.to_wallet_id, {
    message: "Le portefeuille source et destination doivent être différents.",
    path: ["to_wallet_id"],
  })

export type CreateTransferSchema = z.infer<typeof createTransferSchema>
