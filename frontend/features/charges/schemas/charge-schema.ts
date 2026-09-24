import { z } from "zod"

import { CHARGE_TYPE_VALUES } from "@/features/charges/constants/charge-types"
import { CHARGE_ORDER_TRIGGER_VALUES } from "@/features/charges/constants/charge-order-triggers"
import { CHARGE_RECURRENCE_FREQUENCY_VALUES } from "@/features/charges/constants/charge-recurrence-frequencies"

export const chargeSchema = z
  .object({
    category: z.string().min(1),
    type: z.enum(CHARGE_TYPE_VALUES),
    order_trigger: z.enum(CHARGE_ORDER_TRIGGER_VALUES).nullable(),
    recurrence_frequency: z.enum(CHARGE_RECURRENCE_FREQUENCY_VALUES).nullable(),
    name: z.string().min(1, "Le nom est requis.").max(255),
    amount: z
      .string()
      .min(1, "Le montant est requis.")
      .refine((value) => Number(value) > 0, "Le montant doit être supérieur à 0."),
    starts_at: z.date().nullable(),
    ends_at: z.date().nullable(),
    all_products: z.boolean(),
    product_ids: z.array(z.number()),
  })
  .refine((data) => data.type !== "per_order" || data.order_trigger !== null, {
    message: "Le type de récurrence est requis.",
    path: ["order_trigger"],
  })
  .refine((data) => data.type !== "recurring" || data.recurrence_frequency !== null, {
    message: "La fréquence est requise.",
    path: ["recurrence_frequency"],
  })

export type ChargeSchema = z.infer<typeof chargeSchema>
