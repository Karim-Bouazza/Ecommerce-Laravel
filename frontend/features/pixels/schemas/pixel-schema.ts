import { z } from "zod"

export const pixelSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  provider: z.literal("facebook"),
  pixel_id: z
    .string()
    .trim()
    .min(1, "L'ID du pixel est requis.")
    .regex(/^\d{10,20}$/, "L'ID du pixel Meta doit contenir uniquement des chiffres (10 à 20)."),
  is_active: z.boolean(),
})

export type PixelSchema = z.infer<typeof pixelSchema>
