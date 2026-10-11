import { z } from "zod"

const baseShape = {
  name: z.string().min(1, "Le nom est requis.").max(255),
  email: z.string().min(1, "L'email est requis.").email("Email invalide.").max(255),
  phone: z.string().max(30).optional(),
  role_id: z.number({ error: "Le rôle est requis." }).int().positive("Le rôle est requis."),
  is_active: z.boolean(),
}

const passwordRule = z.string().min(8, "Au moins 8 caractères.")

function passwordsMatch(
  value: { password?: string; password_confirmation?: string },
  ctx: z.RefinementCtx,
) {
  if ((value.password ?? "") !== (value.password_confirmation ?? "")) {
    ctx.addIssue({
      code: "custom",
      path: ["password_confirmation"],
      message: "Les mots de passe ne correspondent pas.",
    })
  }
}

export const createAdministratorSchema = z
  .object({
    ...baseShape,
    password: passwordRule,
    password_confirmation: z.string().min(1, "La confirmation est requise."),
  })
  .superRefine(passwordsMatch)

/** On edit the password is optional: leaving it empty keeps the current one. */
export const updateAdministratorSchema = z
  .object({
    ...baseShape,
    password: z.union([z.literal(""), passwordRule]).optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine(passwordsMatch)

export type CreateAdministratorSchema = z.infer<typeof createAdministratorSchema>
export type UpdateAdministratorSchema = z.infer<typeof updateAdministratorSchema>
export type AdministratorFormValues = {
  name: string
  email: string
  phone?: string
  role_id: number
  is_active: boolean
  password?: string
  password_confirmation?: string
}
