"use client"

import * as React from "react"
import { format } from "date-fns"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker/date-picker"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

export type WilayaAnalyticsFiltersValue = {
  date_from?: string
  date_to?: string
  product_id?: number
  price_min?: number
  price_max?: number
}

const emptyFilters: WilayaAnalyticsFiltersValue = {}

type WilayaAnalyticsFiltersSheetProps = {
  value: WilayaAnalyticsFiltersValue
  onApply: (value: WilayaAnalyticsFiltersValue) => void
}

function toNumberOrUndefined(rawValue: string): number | undefined {
  return rawValue === "" ? undefined : Number(rawValue)
}

export function WilayaAnalyticsFiltersSheet({ value, onApply }: WilayaAnalyticsFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<WilayaAnalyticsFiltersValue>(value)
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

        <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-4">
          <Field>
            <FieldLabel className="flex items-center gap-2">
              Par date de changement de statut
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Date de création" />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>

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
            <FieldLabel className="flex items-center gap-2">
              Canaux de vente
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les canaux" />
              </SelectTrigger>
              <SelectContent />
            </Select>
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
            <FieldLabel className="flex items-center gap-2">
              Agent
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les agents" />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              Marketer
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les marketers" />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-price-min">MIN (DZD)</FieldLabel>
            <Input
              id="filter-price-min"
              type="number"
              value={draft.price_min ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  price_min: toNumberOrUndefined(event.target.value),
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-price-max">MAX (DZD)</FieldLabel>
            <Input
              id="filter-price-max"
              type="number"
              value={draft.price_max ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  price_max: toNumberOrUndefined(event.target.value),
                }))
              }
            />
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
