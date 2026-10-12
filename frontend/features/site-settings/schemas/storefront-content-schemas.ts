import { z } from "zod"

const optionalText = (max: number) =>
  z.string().trim().max(max, `${max} caractères maximum.`)

const image = z.instanceof(File).nullable()

export const featureSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").max(80, "80 caractères maximum."),
  description: optionalText(200),
  image,
})

export type FeatureSchema = z.infer<typeof featureSchema>

export const promoBannerSchema = z.object({
  eyebrow: optionalText(60),
  title: z.string().trim().min(1, "Le titre est requis.").max(100, "100 caractères maximum."),
  description: optionalText(200),
  button_label: z.string().trim().min(1, "Le texte du bouton est requis.").max(30, "30 caractères maximum."),
  link_url: z
    .string()
    .trim()
    .max(255)
    .refine(
      (value) => value === "" || /^(\/|https?:\/\/)/.test(value),
      "Le lien doit commencer par « / » (page du site) ou par « http(s):// »."
    ),
  highlight: z.boolean(),
  image,
})

export type PromoBannerSchema = z.infer<typeof promoBannerSchema>
