import { z } from "zod"
import { MAX_ORDER_QUANTITY } from "./product-data"

export type CodOrderValidationMessages = {
  firstName: string
  lastName: string
  phone: string
  wilaya: string
  wilayaNotFound: string
  commune: string
  option: string
}

export function createCodOrderSchema(
  requireVariant: boolean,
  messages: CodOrderValidationMessages,
) {
  return z
    .object({
      first_name: z.string().trim().min(2, messages.firstName),
      last_name: z.string().trim().min(2, messages.lastName),
      phone_number: z
        .string()
        .trim()
        .regex(/^0[567]\d{8}$/, messages.phone),
      provider_wilaya_id: z.number().nullable(),
      wilaya_id: z.number().nullable(),
      provider_commune_id: z.number().nullable(),
      delivery_type: z.enum(["home", "stopdesk"]),
      variant_id: z.number().nullable(),
      quantity: z.number().int().min(1).max(MAX_ORDER_QUANTITY),
    })
    .refine((data) => data.provider_wilaya_id !== null, {
      message: messages.wilaya,
      path: ["provider_wilaya_id"],
    })
    .refine((data) => data.provider_wilaya_id === null || data.wilaya_id !== null, {
      message: messages.wilayaNotFound,
      path: ["provider_wilaya_id"],
    })
    .refine((data) => data.provider_commune_id !== null, {
      message: messages.commune,
      path: ["provider_commune_id"],
    })
    .refine((data) => !requireVariant || data.variant_id !== null, {
      message: messages.option,
      path: ["variant_id"],
    })
}

export type CodOrderSchema = z.infer<ReturnType<typeof createCodOrderSchema>>
