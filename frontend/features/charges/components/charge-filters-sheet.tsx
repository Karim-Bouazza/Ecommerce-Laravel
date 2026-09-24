"use client"

import * as React from "react"
import { format } from "date-fns"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker/date-picker"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { CHARGE_CATEGORIES } from "@/features/charges/constants/charge-categories"
import { CHARGE_TYPES } from "@/features/charges/constants/charge-types"
import type { ChargeTypeValue } from "@/features/charges/constants/charge-types"

export type ChargeFiltersValue = {
  date_from?: string
  date_to?: string
  product_id?: number
  type?: ChargeTypeValue
  category?: string
  payment_status?: "unpaid" | "partial" | "paid"
}

const emptyFilters: ChargeFiltersValue = {}

const PAYMENT_STATUS_OPTIONS: { value: NonNullable<ChargeFiltersValue["payment_status"]>; label: string }[] = [
  { value: "unpaid", label: "Non payé" },
  { value: "partial", label: "Partiellement payé" },
  { value: "paid", label: "Payé" },
]

type ChargeFiltersSheetProps = {
  value: ChargeFiltersValue
  onApply: (value: ChargeFiltersValue) => void
}

export function ChargeFiltersSheet({ value, onApply }: ChargeFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<ChargeFiltersValue>(value)
  const { data: products = [] } = useProductOptions()

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setDraft(value)
      }}
    >
      <SheetTrigger render={<Button variant="outline" />}>
        <Filter className="size-4" />
        Filtres
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>

        <FieldGroup className="px-4">
          <Field>
            <FieldLabel>De</FieldLabel>
            <DatePicker
              value={draft.date_from ? new Date(draft.date_from) : undefined}
              onChange={(date) =>
                setDraft((current) => ({
                  ...current,
                  date_from: date ? format(date, "yyyy-MM-dd") : undefined,
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel>À</FieldLabel>
            <DatePicker
              value={draft.date_to ? new Date(draft.date_to) : undefined}
              onChange={(date) =>
                setDraft((current) => ({
                  ...current,
                  date_to: date ? format(date, "yyyy-MM-dd") : undefined,
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel>Produits</FieldLabel>
            <Select
              value={draft.product_id ? String(draft.product_id) : null}
              onValueChange={(next) =>
                setDraft((current) => ({ ...current, product_id: Number(next) }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les produits" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={draft.type ?? null}
              onValueChange={(next) =>
                setDraft((current) => ({ ...current, type: next as ChargeTypeValue }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                {CHARGE_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <Select
              value={draft.category ?? null}
              onValueChange={(next) =>
                setDraft((current) => ({ ...current, category: next ?? undefined }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                {CHARGE_CATEGORIES.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Statut de paiement</FieldLabel>
            <Select
              value={draft.payment_status ?? null}
              onValueChange={(next) =>
                setDraft((current) => ({
                  ...current,
                  payment_status: next as ChargeFiltersValue["payment_status"],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <SheetFooter className="flex-row justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setDraft(emptyFilters)
              onApply(emptyFilters)
              setOpen(false)
            }}
          >
            Réinitialiser
          </Button>
          <Button
            onClick={() => {
              onApply(draft)
              setOpen(false)
            }}
          >
            Appliquer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
