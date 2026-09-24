import { z } from "zod"

const hexColor = z
  .string()
  .min(1, "La couleur est requise.")
  .regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hex invalide (ex. #007FFF).")

export const colorsThemeSchema = z.object({
  primary_color: hexColor,
  primary_dark_color: hexColor,
  primary_mid_color: hexColor,
  accent_color: hexColor,
  accent_light_color: hexColor,
  contrast_color: hexColor,
})

export type ColorsThemeSchema = z.infer<typeof colorsThemeSchema>
