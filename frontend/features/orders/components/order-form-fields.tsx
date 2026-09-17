"use client"

import * as React from "react"
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"
import { ProviderCommuneSelect } from "@/features/wilayas/components/provider-commune-select"
import { ProviderWilayaSelect } from "@/features/wilayas/components/provider-wilaya-select"
import { EntitySelect } from "@/features/orders/components/entity-select"
import { OrderItemRow } from "@/features/orders/components/order-item-row"
import { generateOrderName } from "@/features/orders/api/order-api"
import { useDeliveryCompanyOptions } from "@/features/orders/hooks/use-delivery-company-options"
import { useWarehouseOptions } from "@/features/orders/hooks/use-warehouse-options"
import type { CreateOrderSchema } from "@/features/orders/schemas/order-schema"

type OrderFormFieldsProps = {
  form: UseFormReturn<CreateOrderSchema>
  idPrefix: string
}

const amountFormatter = new Intl.NumberFormat("fr-FR")

export function OrderFormFields({ form, idPrefix }: OrderFormFieldsProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const { data: warehouses = [] } = useWarehouseOptions()
  const { data: deliveryCompanies = [] } = useDeliveryCompanyOptions()

  const deliveryType = watch("delivery_type")
  const items = watch("items")
  const deliveryPrice = watch("delivery_price") ?? 0

  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + (item.unit_price ?? 0) * (item.quantity ?? 0), 0),
    [items]
  )
  const total = subtotal + deliveryPrice

  const providerWilayaId = watch("provider_wilaya_id")

  const nameManuallyEdited = React.useRef(false)
  const skipNextNameSync = React.useRef(true)
  const generateNameMutation = useMutation({ mutationFn: generateOrderName })

  const firstItemProductId = watch("items.0.product_id")
  const firstItemVariant = watch("items.0.variant")

  React.useEffect(() => {
    if (skipNextNameSync.current) {
      skipNextNameSync.current = false
      return
    }

    if (nameManuallyEdited.current) return

    if (!firstItemProductId) {
      setValue("name", "")
      return
    }

    const timeout = setTimeout(() => {
      generateNameMutation.mutate(
        { product_id: firstItemProductId, variant: firstItemVariant || undefined },
        { onSuccess: (generatedName) => setValue("name", generatedName) }
      )
    }, 400)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstItemProductId, firstItemVariant])

  const providerOrderIdManuallyEdited = React.useRef(false)
  const skipNextProviderOrderIdSync = React.useRef(true)
  const generateProviderOrderIdMutation = useMutation({ mutationFn: generateOrderName })

  React.useEffect(() => {
    if (skipNextProviderOrderIdSync.current) {
      skipNextProviderOrderIdSync.current = false
      return
    }

    if (providerOrderIdManuallyEdited.current) return

    if (!firstItemProductId) {
      setValue("provider_order_id", "")
      return
    }

    generateProviderOrderIdMutation.mutate(
      { product_id: firstItemProductId },
      { onSuccess: (generatedName) => setValue("provider_order_id", generatedName) }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstItemProductId])

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <span className="text-sm font-medium">Détails du client</span>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field data-invalid={!!errors.first_name}>
            <FieldLabel htmlFor={`${idPrefix}-first-name`}>Prénom</FieldLabel>
            <Input
              id={`${idPrefix}-first-name`}
              aria-invalid={!!errors.first_name}
              {...register("first_name")}
            />
            <FieldError errors={errors.first_name ? [errors.first_name] : undefined} />
          </Field>

          <Field data-invalid={!!errors.last_name}>
            <FieldLabel htmlFor={`${idPrefix}-last-name`}>Nom</FieldLabel>
            <Input
              id={`${idPrefix}-last-name`}
              aria-invalid={!!errors.last_name}
              {...register("last_name")}
            />
            <FieldError errors={errors.last_name ? [errors.last_name] : undefined} />
          </Field>

          <Field data-invalid={!!errors.phone_number}>
            <FieldLabel htmlFor={`${idPrefix}-phone`}>Téléphone du client</FieldLabel>
            <Input
              id={`${idPrefix}-phone`}
              aria-invalid={!!errors.phone_number}
              {...register("phone_number")}
            />
            <FieldError errors={errors.phone_number ? [errors.phone_number] : undefined} />
          </Field>

          <Field data-invalid={!!errors.wilaya_id}>
            <FieldLabel>Wilaya</FieldLabel>
            <Controller
              control={control}
              name="provider_wilaya_id"
              render={({ field }) => (
                <ProviderWilayaSelect
                  value={field.value}
                  onChange={(providerWilayaId, matchedWilayaId) => {
                    field.onChange(providerWilayaId)
                    setValue("wilaya_id", matchedWilayaId)
                    setValue("provider_commune_id", null)
                  }}
                  invalid={!!errors.wilaya_id}
                />
              )}
            />
            <FieldError errors={errors.wilaya_id ? [errors.wilaya_id] : undefined} />
          </Field>

          <Field data-invalid={!!errors.provider_commune_id}>
            <FieldLabel>Commune</FieldLabel>
            <Controller
              control={control}
              name="provider_commune_id"
              render={({ field }) => (
                <ProviderCommuneSelect
                  providerWilayaId={providerWilayaId}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={!!errors.provider_commune_id}
                />
              )}
            />
            <FieldError errors={errors.provider_commune_id ? [errors.provider_commune_id] : undefined} />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field data-invalid={!!errors.address}>
            <FieldLabel htmlFor={`${idPrefix}-address`}>Adresse du client</FieldLabel>
            <Textarea id={`${idPrefix}-address`} rows={2} {...register("address")} />
            <FieldError errors={errors.address ? [errors.address] : undefined} />
          </Field>

          <Field data-invalid={!!errors.delivery_note}>
            <FieldLabel htmlFor={`${idPrefix}-delivery-note`}>Note pour le livreur</FieldLabel>
            <Textarea id={`${idPrefix}-delivery-note`} rows={2} {...register("delivery_note")} />
            <FieldError errors={errors.delivery_note ? [errors.delivery_note] : undefined} />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Détails du produit</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ warehouse_id: 0, product_id: 0, variant: "", quantity: 1, unit_price: undefined })
            }
          >
            <Plus className="size-4" />
            Ajouter un produit
          </Button>
        </div>

        <FieldGroup className="gap-3">
          {fields.map((fieldItem, index) => (
            <OrderItemRow
              key={fieldItem.id}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              index={index}
              warehouses={warehouses}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
              onProductSelected={(itemIndex, price) => setValue(`items.${itemIndex}.unit_price`, price)}
            />
          ))}
        </FieldGroup>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <span className="text-sm font-medium">Livraison</span>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={deliveryType === "express" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setValue("delivery_type", "express")}
          >
            Express
          </Button>
          <Button
            type="button"
            variant={deliveryType === "point_relais" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setValue("delivery_type", "point_relais")}
          >
            Point relais
          </Button>
        </div>

        <div className={cn("grid gap-3", deliveryType === "point_relais" ? "sm:grid-cols-2" : "sm:grid-cols-1")}>
          {deliveryType === "point_relais" && (
            <Field data-invalid={!!errors.stop_desk_company_id}>
              <FieldLabel>Société stop desk</FieldLabel>
              <Controller
                control={control}
                name="stop_desk_company_id"
                render={({ field }) => (
                  <EntitySelect
                    value={field.value}
                    onChange={field.onChange}
                    options={deliveryCompanies}
                    placeholder="Sélectionner une société"
                    invalid={!!errors.stop_desk_company_id}
                  />
                )}
              />
              <FieldError
                errors={errors.stop_desk_company_id ? [errors.stop_desk_company_id] : undefined}
              />
            </Field>
          )}

          <Field data-invalid={!!errors.delivery_price}>
            <FieldLabel htmlFor={`${idPrefix}-delivery-price`}>Frais de livraison</FieldLabel>
            <Controller
              control={control}
              name="delivery_price"
              render={({ field }) => (
                <Input
                  id={`${idPrefix}-delivery-price`}
                  type="number"
                  min={0}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(event.target.value === "" ? undefined : Number(event.target.value))
                  }
                />
              )}
            />
            <FieldError errors={errors.delivery_price ? [errors.delivery_price] : undefined} />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <span className="text-sm font-medium">Informations Commande</span>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor={`${idPrefix}-name`}>Nom de la commande</FieldLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id={`${idPrefix}-name`}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    nameManuallyEdited.current = true
                    field.onChange(event)
                  }}
                  placeholder="Généré depuis le premier produit"
                  aria-invalid={!!errors.name}
                />
              )}
            />
            <FieldError errors={errors.name ? [errors.name] : undefined} />
          </Field>

          <Field data-invalid={!!errors.provider_order_id}>
            <FieldLabel htmlFor={`${idPrefix}-provider-order-id`}>N° de commande prestataire</FieldLabel>
            <Controller
              control={control}
              name="provider_order_id"
              render={({ field }) => (
                <Input
                  id={`${idPrefix}-provider-order-id`}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    providerOrderIdManuallyEdited.current = true
                    field.onChange(event)
                  }}
                  placeholder="Généré depuis le premier produit"
                  aria-invalid={!!errors.provider_order_id}
                />
              )}
            />
            <FieldError errors={errors.provider_order_id ? [errors.provider_order_id] : undefined} />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${idPrefix}-free-delivery`}>Livraison gratuite</FieldLabel>
            <Controller
              control={control}
              name="free_delivery"
              render={({ field }) => (
                <div>
                  <Switch
                    id={`${idPrefix}-free-delivery`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`${idPrefix}-can-be-opened`}>Peut être ouvert</FieldLabel>
            <Controller
              control={control}
              name="can_be_opened"
              render={({ field }) => (
                <div>
                  <Switch
                    id={`${idPrefix}-can-be-opened`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <span className="text-sm font-medium">Commander</span>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{amountFormatter.format(subtotal)} DZD</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Livraison</span>
            <span className="font-medium">{amountFormatter.format(deliveryPrice)} DZD</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Total</span>
            <span className="text-base font-semibold">{amountFormatter.format(total)} DZD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
