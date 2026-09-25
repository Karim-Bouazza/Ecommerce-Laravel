"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  House,
  Loader2,
  Minus,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { cn } from "cn";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getErrorMessage } from "@/lib/api";
import { trackInitiateCheckout, trackPurchase } from "@/features/pixels/lib/track-events";
import { ProviderWilayaSelect } from "@/features/wilayas/components/provider-wilaya-select";
import { ProviderCommuneSelect } from "@/features/wilayas/components/provider-commune-select";
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas";
import { useProviderHomeDeliveryPrice } from "@/features/wilayas/hooks/use-provider-home-delivery-price";
import type { Wilaya } from "@/features/wilayas/types";
import { formatPrice } from "@/shared/lib/format-price";
import type { StorefrontProductDetail } from "@/features/storefront/catalog/api/products-api";
import { createStorefrontOrder } from "./api/orders-api";
import { createCodOrderSchema, type CodOrderSchema } from "./cod-order-schema";
import { MAX_ORDER_QUANTITY, type DeliveryType } from "./product-data";

function stopDeskPriceFor(wilaya: Wilaya | undefined): number | null {
  if (!wilaya) return null
  return wilaya.price_stop_desk
}

const DELIVERY_OPTIONS: {
  value: DeliveryType;
  label: string;
  hint: string;
  icon: typeof House;
}[] = [
  {
    value: "home",
    label: "À domicile",
    hint: "Livré à votre adresse",
    icon: House,
  },
  {
    value: "stopdesk",
    label: "Stop desk",
    hint: "Retrait au bureau",
    icon: Building2,
  },
];

function QuantityStepper({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
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
      <span
        className="w-8 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
      >
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
  );
}

export function CodOrderForm({
  product,
}: {
  product: StorefrontProductDetail;
}) {
  const [confirmed, setConfirmed] = useState<{
    values: CodOrderSchema;
    reference: string;
  } | null>(null);

  const hasVariants = product.variants.length > 0;
  const schema = useMemo(() => createCodOrderSchema(hasVariants), [hasVariants]);

  const form = useForm<CodOrderSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      provider_wilaya_id: null,
      wilaya_id: null,
      provider_commune_id: null,
      delivery_type: "home",
      variant_id: null,
      quantity: 1,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const [quantity, providerWilayaId, wilayaId, providerCommuneId, deliveryType] = useWatch({
    control,
    name: ["quantity", "provider_wilaya_id", "wilaya_id", "provider_commune_id", "delivery_type"],
  });
  const maxQuantity = Math.min(MAX_ORDER_QUANTITY, product.stock);

  const { data: wilayas = [] } = useWilayas();
  const selectedWilaya = useMemo(
    () => wilayas.find((w) => w.id === wilayaId),
    [wilayas, wilayaId],
  );

  const { data: homeDeliveryPrice = null } = useProviderHomeDeliveryPrice(providerWilayaId);
  const stopDeskPrice = providerCommuneId !== null ? stopDeskPriceFor(selectedWilaya) : null;

  const subtotal = product.price * quantity;
  const deliveryPrice = deliveryType === "home" ? homeDeliveryPrice : stopDeskPrice;
  const total = subtotal + (deliveryPrice ?? 0);

  const lastTrackedCommuneId = useRef<number | null>(null);
  useEffect(() => {
    if (providerCommuneId === null || providerCommuneId === lastTrackedCommuneId.current) {
      return;
    }
    lastTrackedCommuneId.current = providerCommuneId;
    trackInitiateCheckout({
      id: product.id,
      name: product.name,
      value: total,
      quantity,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerCommuneId]);

  const orderMutation = useMutation({ mutationFn: createStorefrontOrder });

  const onSubmit = handleSubmit(async (values) => {
    const selectedVariant = product.variants.find((v) => v.id === values.variant_id);

    try {
      const order = await orderMutation.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        wilaya_id: values.wilaya_id as number,
        provider_wilaya_id: values.provider_wilaya_id as number,
        provider_commune_id: values.provider_commune_id as number,
        delivery_type: values.delivery_type === "home" ? "express" : "point_relais",
        delivery_price: deliveryPrice ?? undefined,
        items: [
          {
            product_id: product.id,
            variant: selectedVariant?.label,
            quantity: values.quantity,
          },
        ],
      });

      trackPurchase({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        value: total,
        quantity: values.quantity,
      });

      setConfirmed({ values, reference: order.reference });
      toast.success(
        "Commande envoyée ! Nous vous appellerons pour la confirmer.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  if (confirmed) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-xs sm:p-8">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15">
          <CheckCircle2 className="size-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">
          Merci {confirmed.values.first_name} !
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Votre commande{" "}
          <span className="font-medium text-foreground">
            #{confirmed.reference}
          </span>{" "}
          de {confirmed.values.quantity} × {product.name} a bien été
          enregistrée. Un conseiller vous appellera au{" "}
          <span className="font-medium text-foreground">
            {confirmed.values.phone_number}
          </span>{" "}
          pour la confirmer. Vous paierez à la livraison.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setConfirmed(null);
          }}
          className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Passer une autre commande
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="cod-form-title"
      className="rounded-3xl border border-border bg-card p-4 shadow-xs sm:p-6"
    >
      <div className="mb-5">
        <h2 id="cod-form-title" className="text-base font-semibold text-center">
          Commander maintenant
        </h2>
      </div>

      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.last_name}>
            <FieldLabel htmlFor="last_name">Nom</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                id="last_name"
                autoComplete="family-name"
                placeholder="Entrer Nom"
                aria-invalid={!!errors.last_name}
                {...register("last_name")}
              />
            </InputGroup>
            <FieldError
              errors={errors.last_name ? [errors.last_name] : undefined}
            />
          </Field>

          <Field data-invalid={!!errors.first_name}>
            <FieldLabel htmlFor="first_name">Prénom</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                id="first_name"
                autoComplete="given-name"
                placeholder="Entrer Prénom"
                aria-invalid={!!errors.first_name}
                {...register("first_name")}
              />
            </InputGroup>
            <FieldError
              errors={errors.first_name ? [errors.first_name] : undefined}
            />
          </Field>

        </div>

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
              placeholder="Entrer téléphone"
              aria-invalid={!!errors.phone_number}
              {...register("phone_number")}
            />
          </InputGroup>
          <FieldError
            errors={errors.phone_number ? [errors.phone_number] : undefined}
          />
        </Field>

        <Field data-invalid={!!errors.provider_wilaya_id}>
          <FieldLabel htmlFor="provider_wilaya_id">Wilaya</FieldLabel>
          <Controller
            control={control}
            name="provider_wilaya_id"
            render={({ field }) => (
              <ProviderWilayaSelect
                value={field.value}
                onChange={(providerWilayaId, matchedWilayaId) => {
                  field.onChange(providerWilayaId);
                  setValue("wilaya_id", matchedWilayaId);
                  setValue("provider_commune_id", null);
                }}
                placeholder="Choisir la wilaya"
                invalid={!!errors.provider_wilaya_id}
                className="data-[size=default]:h-11"
              />
            )}
          />
          <FieldError
            errors={errors.provider_wilaya_id ? [errors.provider_wilaya_id] : undefined}
          />
        </Field>

        <Field data-invalid={!!errors.provider_commune_id}>
          <FieldLabel htmlFor="provider_commune_id">Commune</FieldLabel>
          <Controller
            control={control}
            name="provider_commune_id"
            render={({ field }) => (
              <ProviderCommuneSelect
                providerWilayaId={providerWilayaId}
                value={field.value}
                onChange={field.onChange}
                placeholder="Choisir la commune"
                invalid={!!errors.provider_commune_id}
                className="data-[size=default]:h-11"
              />
            )}
          />
          <FieldError
            errors={errors.provider_commune_id ? [errors.provider_commune_id] : undefined}
          />
        </Field>

        <Field>
          <FieldLabel>Mode de livraison</FieldLabel>
          <Controller
            control={control}
            name="delivery_type"
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="Mode de livraison"
                className="grid grid-cols-2 gap-3"
              >
                {DELIVERY_OPTIONS.map((option) => {
                  const selected = field.value === option.value;
                  const price = option.value === "home" ? homeDeliveryPrice : stopDeskPrice;
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
                          : "border-border hover:bg-muted",
                      )}
                    >
                      <option.icon
                        className={cn(
                          "mt-0.5 size-5 shrink-0",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">
                          {option.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {price !== null ? formatPrice(price) : option.hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </Field>

        {hasVariants && (
          <Field data-invalid={!!errors.variant_id}>
            <FieldLabel>Choisissez une option</FieldLabel>
            <Controller
              control={control}
              name="variant_id"
              render={({ field }) => (
                <div
                  role="radiogroup"
                  aria-label="Variante"
                  className="flex flex-wrap gap-2"
                >
                  {product.variants.map((variant) => {
                    const selected = field.value === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(variant.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError
              errors={errors.variant_id ? [errors.variant_id] : undefined}
            />
          </Field>
        )}

      </FieldGroup>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Quantité</span>
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => (
            <QuantityStepper
              value={field.value}
              onChange={field.onChange}
              max={maxQuantity}
            />
          )}
        />
      </div>

      <dl className="mt-5 space-y-2 rounded-2xl bg-muted/60 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">
            Sous-total ({quantity} article{quantity > 1 ? "s" : ""})
          </dt>
          <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Livraison</dt>
          <dd className="font-medium tabular-nums">
            {deliveryPrice !== null
              ? formatPrice(deliveryPrice)
              : "Choisissez une wilaya"}
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
  );
}
