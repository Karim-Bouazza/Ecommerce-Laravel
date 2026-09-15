import { z } from "zod"

export const walletDepositSchema = z.object({
  date: z.date(),
  amount: z
    .string()
    .min(1, "Le montant est requis.")
    .refine((value) => Number(value) > 0, "Le montant doit être supérieur à 0."),
  remark: z.string().max(255).optional(),
})

export type WalletDepositSchema = z.infer<typeof walletDepositSchema>
