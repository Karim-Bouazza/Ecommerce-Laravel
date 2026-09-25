import { z } from "zod"

export const pixelSchema = z.object({
  name: z.string().min(1, "Le nom est requis.").max(255),
  provider: z.enum(["facebook", "tiktok", "snapchat", "google"], {
    message: "Le fournisseur est requis.",
  }),
  pixel_id: z.string().min(1, "L'ID du pixel est requis.").max(255),
  is_active: z.boolean(),
})

export type PixelSchema = z.infer<typeof pixelSchema>
