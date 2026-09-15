import { z } from "zod"

export const warehouseSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  phone: z.string().max(30).optional(),
  remark: z.string().max(255).optional(),
  address: z.string().optional(),
  all_wilayas: z.boolean(),
  all_products: z.boolean(),
  wilaya_ids: z.array(z.number()),
  product_ids: z.array(z.number()),
})

export type WarehouseSchema = z.infer<typeof warehouseSchema>
