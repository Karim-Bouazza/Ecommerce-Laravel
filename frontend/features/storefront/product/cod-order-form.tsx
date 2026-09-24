"use client"

import { useMemo, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Building2, CheckCircle2, House, Loader2, MapPin, Minus, Phone, Plus, User } from "lucide-react"
import { cn } from "cn"

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/shared/lib/format-price"
import { codOrderSchema, type CodOrderSchema } from "./cod-order-schema"
import {
  MAX_ORDER_QUANTITY,
  WILAYAS,
  getDeliveryPrice,
  type DeliveryType,
  type ProductDetail,
} from "./product-data"

const DELIVERY_OPTIONS: { value: DeliveryType; label: string; hint: string; icon: typeof House }[] = [
  { value: "home", label: "À domicile", hint: "Livré à votre adresse", icon: House },
  { value: "stopdesk", label: "Stop desk", hint: "Retrait au bureau", icon: Building2 },
]

const wilayaNameById = new Map(WILAYAS.map((w) => [String(w.id), `${String(w.id).padStart(2, "0")} - ${w.name}`]))

function QuantityStepper({
  value,
  onChange,
  max,
}: {
  value: number
  onChange: (value: number) => void
  max: number
}) {
  return (
    <div className="inline-flex h-11 items-center rounded-full border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export function CodOrderForm({ product }: { product: ProductDetail }) {
  const [confirmed, setConfirmed] = useState<CodOrderSchema | null>(null)
  const form = useForm<CodOrderSchema>({
    resolver: zodResolver(codOrderSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      wilaya_id: null,
      commune: "",
      address: "",
      delivery_type: "home",
      quantity: 1,
      note: "",
    },
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const [quantity, wilayaId, deliveryType] = useWatch({
    control,
    name: ["quantity", "wilaya_id", "delivery_type"],
  })
  const maxQuantity = Math.min(MAX_ORDER_QUANTITY, product.stock)

  const subtotal = product.price * quantity
  const deliveryPrice = getDeliveryPrice(wilayaId, deliveryType)
  const total = subtotal + (deliveryPrice ?? 0)

  const deliveryHints = useMemo(
    () =>
      Object.fromEntries(
        DELIVERY_OPTIONS.map((o) => [o.value, getDeliveryPrice(wilayaId, o.value)])
      ) as Record<DeliveryType, number | null>,
    [wilayaId]
  )

  const onSubmit = handleSubmit(async (values) => {
    // TODO: envoyer la commande à l'API (POST /api/v1/storefront/orders)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setConfirmed(values)
    toast.success("Commande envoyée ! Nous vous appellerons pour la confirmer.")
  })

  if (confirmed) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-xs sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Merci {confirmed.full_name} !</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Votre commande de {confirmed.quantity} × {product.name} a bien été enregistrée. Un conseiller
          vous appellera au <span className="font-medium text-foreground">{confirmed.phone_number}</span> pour
          la confirmer. Vous paierez à la livraison.
        </p>
        <button
          type="button"
          onClick={() => {
            reset()
            setConfirmed(null)
          }}
          className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Passer une autre commande
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="cod-form-title"
      className="rounded-3xl border border-border bg-card p-4 shadow-xs sm:p-6"
    >
      <div className="mb-5">
        <h2 id="cod-form-title" className="text-base font-semibold">
          Commander maintenant
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Remplissez le formulaire, vous payez à la réception.
        </p>
      </div>

      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.full_name}>
            <FieldLabel htmlFor="full_name">Nom complet</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                id="full_name"
                autoComplete="name"
                placeholder="Mohamed Benali"
                aria-invalid={!!errors.full_name}
                {...register("full_name")}
              />
            </InputGroup>
            <FieldError errors={errors.full_name ? [errors.full_name] : undefined} />
          </Field>

          <Field data-invalid={!!errors.phone_number}>
            <FieldLabel htmlFor="phone_number">Téléphone</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <Phone />
              </InputGroupAddon>
              <InputGroupInput
                id="phone_number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="0550123456"
                aria-invalid={!!errors.phone_number}
                {...register("phone_number")}
              />
            </InputGroup>
            <FieldError errors={errors.phone_number ? [errors.phone_number] : undefined} />
          </Field>

          <Field data-invalid={!!errors.wilaya_id}>
            <FieldLabel htmlFor="wilaya_id">Wilaya</FieldLabel>
            <Controller
              control={control}
              name="wilaya_id"
              render={({ field }) => (
                <Select
                  value={field.value !== null ? String(field.value) : null}
                  onValueChange={(next) => field.onChange(Number(next))}
                >
                  <SelectTrigger id="wilaya_id" className="h-11! w-full" aria-invalid={!!errors.wilaya_id}>
                    <SelectValue placeholder="Choisir la wilaya">
                      {(selected: string | null) =>
                        selected ? wilayaNameById.get(selected) : "Choisir la wilaya"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {WILAYAS.map((wilaya) => (
                      <SelectItem key={wilaya.id} value={String(wilaya.id)}>
                        {wilayaNameById.get(String(wilaya.id))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={errors.wilaya_id ? [errors.wilaya_id] : undefined} />
          </Field>

          <Field data-invalid={!!errors.commune}>
            <FieldLabel htmlFor="commune">Commune</FieldLabel>
            <Input
              id="commune"
              placeholder="Bab Ezzouar"
              className="h-11"
              aria-invalid={!!errors.commune}
              {...register("commune")}
            />
            <FieldError errors={errors.commune ? [errors.commune] : undefined} />
          </Field>
        </div>

        <Field>
          <FieldLabel>Mode de livraison</FieldLabel>
          <Controller
            control={control}
            name="delivery_type"
            render={({ field }) => (
              <div role="radiogroup" aria-label="Mode de livraison" className="grid grid-cols-2 gap-3">
                {DELIVERY_OPTIONS.map((option) => {
                  const selected = field.value === option.value
                  const price = deliveryHints[option.value]
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      <option.icon className={cn("mt-0.5 size-5 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{option.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {price !== null ? formatPrice(price) : option.hint}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          />
        </Field>

        {deliveryType === "home" && (
          <Field data-invalid={!!errors.address}>
            <FieldLabel htmlFor="address">
              Adresse <span className="font-normal text-muted-foreground">(optionnel)</span>
            </FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput
                id="address"
                autoComplete="street-address"
                placeholder="Cité, rue, n° de bâtiment…"
                {...register("address")}
              />
            </InputGroup>
            <FieldError errors={errors.address ? [errors.address] : undefined} />
          </Field>
        )}

        <Field data-invalid={!!errors.note}>
          <FieldLabel htmlFor="note">
            Remarque <span className="font-normal text-muted-foreground">(optionnel)</span>
          </FieldLabel>
          <Textarea
            id="note"
            rows={2}
            placeholder="Horaires de disponibilité, point de repère…"
            {...register("note")}
          />
          <FieldError errors={errors.note ? [errors.note] : undefined} />
        </Field>
      </FieldGroup>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Quantité</span>
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <QuantityStepper value={field.value} onChange={field.onChange} max={maxQuantity} />
          )}
        />
      </div>

      <dl className="mt-5 space-y-2 rounded-2xl bg-muted/60 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Sous-total ({quantity} article{quantity > 1 ? "s" : ""})</dt>
          <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Livraison</dt>
          <dd className="font-medium tabular-nums">
            {deliveryPrice !== null ? formatPrice(deliveryPrice) : "Choisissez une wilaya"}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-bold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Confirmer la commande
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Paiement à la livraison · Aucun prépaiement requis
      </p>
    </form>
  )
}
