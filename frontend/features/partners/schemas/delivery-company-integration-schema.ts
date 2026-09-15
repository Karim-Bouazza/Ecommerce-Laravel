import { z } from "zod"

export const deliveryCompanyIntegrationSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  api_token: z.string().min(1, "Le jeton API est requis.").max(1000),
})

export type DeliveryCompanyIntegrationSchema = z.infer<typeof deliveryCompanyIntegrationSchema>
