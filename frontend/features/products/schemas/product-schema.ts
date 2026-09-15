import { z } from "zod"

const baseProductFields = {
  name: z.string().min(1, "Le nom est requis.").max(255),
  description: z.string().min(1, "La description est requise."),
  category_id: z.number().nullable(),
  purchase_price: z.number().min(0).nullable(),
  price: z.number().min(0, "Le prix de vente est requis."),
  is_active: z.boolean(),
}

export const productSchema = z.object({
  ...baseProductFields,
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "L'image est requise." }),
})

export const productUpdateSchema = z.object({
  ...baseProductFields,
  image: z.instanceof(File).nullable(),
})

export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormOutput = z.output<typeof productSchema>

export type ProductUpdateFormInput = z.input<typeof productUpdateSchema>
export type ProductUpdateFormOutput = z.output<typeof productUpdateSchema>
