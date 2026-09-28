import { z } from "zod";

const specSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const baseProductFields = {
  name: z.string().min(1, "Le nom est requis.").max(255),
  sku: z.string().max(100).nullable(),
  description: z.string().min(1, "La description est requise."),
  short_description: z.string().max(500).nullable(),
  category_id: z.number().nullable(),
  brand_id: z.number().nullable(),
  purchase_price: z.number().min(0).nullable(),
  price: z.number().min(0, "Le prix de vente est requis."),
  compare_price: z.number().min(0).nullable(),
  is_active: z.boolean(),
  is_new: z.boolean(),
  tags: z.array(z.number()),
  specs: z.array(specSchema),
  variants: z.array(z.string()),
};

function checkComparePrice(
  values: { price: number; compare_price?: number | null },
  ctx: z.RefinementCtx,
) {
  if (values.compare_price != null && values.compare_price <= values.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["compare_price"],
      message: "Le prix comparé doit être supérieur au prix de vente.",
    });
  }
}

export const productSchema = z
  .object({
    ...baseProductFields,
    image_1: z
      .instanceof(File)
      .nullable()
      .refine((file) => file !== null, { message: "L'image est requise." }),
    image_2: z.instanceof(File).nullable(),
    image_3: z.instanceof(File).nullable(),
    image_4: z.instanceof(File).nullable(),
  })
  .superRefine(checkComparePrice);

export const productUpdateSchema = z
  .object({
    ...baseProductFields,
    image_1: z.instanceof(File).nullable(),
    image_2: z.instanceof(File).nullable(),
    image_3: z.instanceof(File).nullable(),
    image_4: z.instanceof(File).nullable(),
  })
  .superRefine(checkComparePrice);

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormOutput = z.output<typeof productSchema>;

export type ProductUpdateFormInput = z.input<typeof productUpdateSchema>;
export type ProductUpdateFormOutput = z.output<typeof productUpdateSchema>;
