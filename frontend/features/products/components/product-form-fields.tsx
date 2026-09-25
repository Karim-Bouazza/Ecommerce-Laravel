"use client"

import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CategorySelect } from "@/features/categories/components/category-select"
import { BrandSelect } from "@/features/brands/components/brand-select"
import { MultiSelectCombobox } from "@/components/multi-select/multi-select-combobox"
import { TagsInput } from "@/components/tags-input/tags-input"
import { useTags } from "@/features/tags/hooks/use-tags"
import type { ProductFormInput } from "@/features/products/schemas/product-schema"

type ProductFormFieldsProps<TOutput> = {
  form: UseFormReturn<ProductFormInput, unknown, TOutput>
  idPrefix: string
  currentImageUrl?: string | null
}

export function ProductFormFields<TOutput>({
  form,
  idPrefix,
  currentImageUrl,
}: ProductFormFieldsProps<TOutput>) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({ control, name: "specs" })
  const { data: tagOptions = [] } = useTags()

  return (
    <div className="grid items-start gap-4 py-4 sm:grid-cols-2 sm:gap-x-8">
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={`${idPrefix}-name`}>Nom</FieldLabel>
          <Input id={`${idPrefix}-name`} aria-invalid={!!errors.name} {...register("name")} />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.sku}>
          <FieldLabel htmlFor={`${idPrefix}-sku`}>SKU</FieldLabel>
          <Input
            id={`${idPrefix}-sku`}
            aria-invalid={!!errors.sku}
            {...register("sku", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
          />
          <FieldError errors={errors.sku ? [errors.sku] : undefined} />
        </Field>

        <Field data-invalid={!!errors.short_description}>
          <FieldLabel htmlFor={`${idPrefix}-short-description`}>Description courte</FieldLabel>
          <Textarea
            id={`${idPrefix}-short-description`}
            rows={2}
            aria-invalid={!!errors.short_description}
            {...register("short_description", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
          />
          <FieldError errors={errors.short_description ? [errors.short_description] : undefined} />
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor={`${idPrefix}-description`}>Description</FieldLabel>
          <Textarea
            id={`${idPrefix}-description`}
            rows={4}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          <FieldError errors={errors.description ? [errors.description] : undefined} />
        </Field>

        <Field data-invalid={!!errors.category_id}>
          <FieldLabel htmlFor={`${idPrefix}-category`}>Catégorie</FieldLabel>
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <CategorySelect
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.category_id}
              />
            )}
          />
          <FieldError errors={errors.category_id ? [errors.category_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.brand_id}>
          <FieldLabel htmlFor={`${idPrefix}-brand`}>Marque</FieldLabel>
          <Controller
            control={control}
            name="brand_id"
            render={({ field }) => (
              <BrandSelect
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.brand_id}
              />
            )}
          />
          <FieldError errors={errors.brand_id ? [errors.brand_id] : undefined} />
        </Field>

        <Field data-invalid={!!errors.image}>
          <FieldLabel htmlFor={`${idPrefix}-image`}>Image</FieldLabel>
          {currentImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImageUrl}
              alt=""
              className="size-16 rounded-md border object-cover"
            />
          )}
          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <Input
                id={`${idPrefix}-image`}
                type="file"
                accept="image/*"
                name={name}
                ref={ref}
                onBlur={onBlur}
                aria-invalid={!!errors.image}
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
              />
            )}
          />
          <FieldError errors={errors.image ? [errors.image] : undefined} />
        </Field>
      </FieldGroup>

      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.purchase_price}>
          <FieldLabel htmlFor={`${idPrefix}-purchase-price`}>Prix d&rsquo;achat (DZD)</FieldLabel>
          <Input
            id={`${idPrefix}-purchase-price`}
            type="number"
            min={0}
            aria-invalid={!!errors.purchase_price}
            {...register("purchase_price", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
          />
          <FieldError errors={errors.purchase_price ? [errors.purchase_price] : undefined} />
        </Field>

        <Field data-invalid={!!errors.price}>
          <FieldLabel htmlFor={`${idPrefix}-price`}>Prix de vente (DZD)</FieldLabel>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min={0}
            aria-invalid={!!errors.price}
            {...register("price", { valueAsNumber: true })}
          />
          <FieldError errors={errors.price ? [errors.price] : undefined} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-is-active`}>Actif</FieldLabel>
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <div>
                <Switch
                  id={`${idPrefix}-is-active`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-is-new`}>Nouveau</FieldLabel>
          <Controller
            control={control}
            name="is_new"
            render={({ field }) => (
              <div>
                <Switch
                  id={`${idPrefix}-is-new`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}-tags`}>Étiquettes</FieldLabel>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <MultiSelectCombobox
                value={field.value}
                onChange={field.onChange}
                options={tagOptions}
                placeholder="Sélectionner des étiquettes"
              />
            )}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Caractéristiques</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ label: "", value: "" })}
            >
              <Plus className="size-4" />
              Ajouter
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="flex items-center gap-2">
                <Input
                  placeholder="Libellé"
                  aria-label="Libellé de la caractéristique"
                  {...register(`specs.${index}.label` as const)}
                />
                <Input
                  placeholder="Valeur"
                  aria-label="Valeur de la caractéristique"
                  {...register(`specs.${index}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Supprimer la caractéristique"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel>Variantes</FieldLabel>
          <p className="text-xs text-muted-foreground">
            Le client pourra choisir une de ces options lors de la commande. Tapez un
            libellé (ex: Rouge / 42) puis appuyez sur Entrée pour l&rsquo;ajouter.
          </p>
          <Controller
            control={control}
            name="variants"
            render={({ field }) => (
              <TagsInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Ex: Rouge / 42"
              />
            )}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
