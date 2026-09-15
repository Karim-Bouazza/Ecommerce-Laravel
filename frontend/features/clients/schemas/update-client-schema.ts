import { z } from "zod"

export const updateClientSchema = z
  .object({
    first_name: z.string().min(1, "Le prénom est requis.").max(255),
    last_name: z.string().min(1, "Le nom est requis.").max(255),
    phone_number: z.string().min(1, "Le téléphone est requis.").max(255),
    wilaya_id: z.number().nullable(),
    commune_id: z.number().nullable(),
  })
  .refine((data) => data.wilaya_id !== null, {
    message: "La wilaya est requise.",
    path: ["wilaya_id"],
  })
  .refine((data) => data.commune_id !== null, {
    message: "La commune est requise.",
    path: ["commune_id"],
  })

export type UpdateClientSchema = z.infer<typeof updateClientSchema>
