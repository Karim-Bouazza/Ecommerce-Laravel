import { z } from "zod"

export const profileSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis.").max(255),
    email: z
      .string()
      .min(1, "L'adresse e-mail est requise.")
      .email("Adresse e-mail invalide."),
    phone: z.string().max(30),
    avatar: z.instanceof(File).nullable(),
    current_password: z.string().optional(),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.password) return

    if (data.password.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      })
    }

    if (!data.current_password) {
      ctx.addIssue({
        code: "custom",
        path: ["current_password"],
        message: "Le mot de passe actuel est requis.",
      })
    }

    if (data.password !== data.password_confirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["password_confirmation"],
        message: "Les mots de passe ne correspondent pas.",
      })
    }
  })

export type ProfileFormInput = z.input<typeof profileSchema>
export type ProfileFormOutput = z.output<typeof profileSchema>
