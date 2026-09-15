import { z } from "zod"

export const supplierSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  phone: z.string().max(30).optional(),
  remark: z.string().max(255).optional(),
  address: z.string().optional(),
})

export type SupplierSchema = z.infer<typeof supplierSchema>
