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
import type { StockMovementTypeValue } from "@/features/stock-movements/types"

export type StockMovementFiltersValue = {
  product_id?: number
  type?: StockMovementTypeValue
  date_from?: string
  date_to?: string
}

const emptyFilters: StockMovementFiltersValue = {}

type StockMovementFiltersSheetProps = {
  value: StockMovementFiltersValue
  onApply: (value: StockMovementFiltersValue) => void
}

export function StockMovementFiltersSheet({ value, onApply }: StockMovementFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<StockMovementFiltersValue>(value)
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
            <FieldLabel htmlFor="filter-date-from">Date début</FieldLabel>
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
            <FieldLabel htmlFor="filter-date-to">Date fin</FieldLabel>
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
              value={draft.product_id ? String(draft.product_id) : undefined}
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
              value={draft.type}
              onValueChange={(next) =>
                setDraft((current) => ({ ...current, type: next as StockMovementTypeValue }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Entrée</SelectItem>
                <SelectItem value="out">Sortie</SelectItem>
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
