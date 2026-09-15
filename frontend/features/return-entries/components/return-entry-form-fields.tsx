"use client"

import * as React from "react"
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EntitySelect, type EntityOption } from "@/features/return-entries/components/entity-select"
import type { ReturnableItem } from "@/features/return-entries/types"
import type { ReturnEntrySchema } from "@/features/return-entries/schemas/return-entry-schema"

const totalFormatter = new Intl.NumberFormat("fr-FR")

type ReturnEntryFormFieldsProps = {
  form: UseFormReturn<ReturnEntrySchema>
  purchaseEntryOptions: EntityOption[]
  returnableItems: ReturnableItem[]
  isLoadingReturnableItems: boolean
  sourceLocked: boolean
  sourceWarehouseName: string | null
  sourceFournisseurName: string | null
  idPrefix: string
}

export function ReturnEntryFormFields({
  form,
  purchaseEntryOptions,
  returnableItems,
  isLoadingReturnableItems,
  sourceLocked,
  sourceWarehouseName,
  sourceFournisseurName,
  idPrefix,
}: ReturnEntryFormFieldsProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const purchaseEntryId = watch("purchase_entry_id")
  const items = watch("items")

  const previousPurchaseEntryId = React.useRef(purchaseEntryId)
  React.useEffect(() => {
    if (!sourceLocked && previousPurchaseEntryId.current && previousPurchaseEntryId.current !== purchaseEntryId) {
      setValue("items", [])
    }
    previousPurchaseEntryId.current = purchaseEntryId
  }, [purchaseEntryId, sourceLocked, setValue])

  const itemById = React.useMemo(() => new Map(returnableItems.map((item) => [item.id, item])), [returnableItems])
  const selectedIds = new Set(items.map((item) => item.purchase_entry_item_id).filter(Boolean))

  const total = items.reduce((sum, item) => {
    const source = itemById.get(item.purchase_entry_item_id)
    return sum + (Number(item.quantity) || 0) * (source?.purchase_price ?? 0)
  }, 0)

  const purchaseEntryName = purchaseEntryOptions.find((option) => option.id === purchaseEntryId)?.name

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field data-invalid={!!errors.purchase_entry_id}>
          <FieldLabel>Entrée d&rsquo;achat</FieldLabel>
          {sourceLocked ? (
            <Input value={purchaseEntryName ?? ""} readOnly disabled />
          ) : (
            <Controller
              control={control}
              name="purchase_entry_id"
              render={({ field }) => (
                <EntitySelect
                  value={field.value || null}
                  onChange={field.onChange}
                  options={purchaseEntryOptions}
                  invalid={!!errors.purchase_entry_id}
                />
              )}
            />
          )}
          <FieldError errors={errors.purchase_entry_id ? [errors.purchase_entry_id] : undefined} />
        </Field>

        <Field>
          <FieldLabel>Entrepôt</FieldLabel>
          <Input value={sourceWarehouseName ?? ""} readOnly disabled />
        </Field>

        <Field>
          <FieldLabel>Fournisseur de produits</FieldLabel>
          <Input value={sourceFournisseurName ?? ""} readOnly disabled />
        </Field>
      </div>

      <Field data-invalid={!!errors.remark}>
        <FieldLabel htmlFor={`${idPrefix}-remark`}>Remarque</FieldLabel>
        <Textarea id={`${idPrefix}-remark`} rows={3} aria-invalid={!!errors.remark} {...register("remark")} />
        <FieldError errors={errors.remark ? [errors.remark] : undefined} />
      </Field>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Produits</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!purchaseEntryId}
            onClick={() => append({ purchase_entry_item_id: 0, quantity: 1 })}
          >
            <Plus className="size-4" />
            Ajouter des produits
          </Button>
        </div>

        {!purchaseEntryId ? (
          <p className="text-sm text-muted-foreground">
            Sélectionnez une entrée d&rsquo;achat pour choisir les produits à retourner.
          </p>
        ) : isLoadingReturnableItems ? (
          <p className="text-sm text-muted-foreground">Chargement des produits…</p>
        ) : (
          <FieldGroup className="gap-3">
            {fields.map((fieldItem, index) => {
              const selectedItemId = items[index]?.purchase_entry_item_id
              const source = itemById.get(selectedItemId)
              const options = returnableItems
                .filter(
                  (item) => item.id === selectedItemId || (!selectedIds.has(item.id) && item.remaining_quantity > 0)
                )
                .map((item) => ({ id: item.id, name: item.product_name ?? `Produit #${item.product_id}` }))

              return (
                <div
                  key={fieldItem.id}
                  className="grid grid-cols-2 items-start gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]"
                >
                  <Field
                    className="col-span-2 sm:col-span-1"
                    data-invalid={!!errors.items?.[index]?.purchase_entry_item_id}
                  >
                    <FieldLabel className="text-xs text-muted-foreground">Nom du produit</FieldLabel>
                    <Controller
                      control={control}
                      name={`items.${index}.purchase_entry_item_id`}
                      render={({ field }) => (
                        <EntitySelect
                          value={field.value || null}
                          onChange={field.onChange}
                          options={options}
                          placeholder="Sélectionner un produit"
                          invalid={!!errors.items?.[index]?.purchase_entry_item_id}
                        />
                      )}
                    />
                    <FieldError
                      errors={
                        errors.items?.[index]?.purchase_entry_item_id
                          ? [errors.items[index]!.purchase_entry_item_id!]
                          : undefined
                      }
                    />
                  </Field>

                  <Field data-invalid={!!errors.items?.[index]?.quantity}>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Quantité{" "}
                      {source && (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          MAX {source.remaining_quantity}
                        </span>
                      )}
                    </FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      max={source?.remaining_quantity}
                      aria-invalid={!!errors.items?.[index]?.quantity}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    <FieldError
                      errors={errors.items?.[index]?.quantity ? [errors.items[index]!.quantity!] : undefined}
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">Prix d&rsquo;achat</FieldLabel>
                    <Input
                      value={source ? `${totalFormatter.format(source.purchase_price)} DZD` : ""}
                      readOnly
                      disabled
                    />
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-5 text-destructive hover:text-destructive"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )
            })}
          </FieldGroup>
        )}
      </div>

      <Field>
        <FieldLabel>Total</FieldLabel>
        <Input value={`${totalFormatter.format(total)} DZD`} readOnly disabled />
      </Field>
    </div>
  )
}
