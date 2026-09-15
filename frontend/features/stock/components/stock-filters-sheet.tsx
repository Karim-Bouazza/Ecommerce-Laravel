"use client"

import * as React from "react"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type StockFiltersValue = {
  purchase_price_min?: number
  purchase_price_max?: number
  stock_interne_min?: number
  stock_interne_max?: number
}

const emptyFilters: StockFiltersValue = {}

type StockFiltersSheetProps = {
  value: StockFiltersValue
  onApply: (value: StockFiltersValue) => void
}

function toNumberOrUndefined(rawValue: string): number | undefined {
  return rawValue === "" ? undefined : Number(rawValue)
}

export function StockFiltersSheet({ value, onApply }: StockFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<StockFiltersValue>(value)

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
            <FieldLabel className="flex items-center gap-2">
              Fournisseur
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les fournisseurs" />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              Marque (catégorie)
              <span className="text-xs text-muted-foreground">(bientôt)</span>
            </FieldLabel>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les marques" />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-purchase-price-min">Prix MIN</FieldLabel>
            <Input
              id="filter-purchase-price-min"
              type="number"
              value={draft.purchase_price_min ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  purchase_price_min: toNumberOrUndefined(event.target.value),
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-purchase-price-max">Prix MAX</FieldLabel>
            <Input
              id="filter-purchase-price-max"
              type="number"
              value={draft.purchase_price_max ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  purchase_price_max: toNumberOrUndefined(event.target.value),
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-stock-interne-min">Interne MIN</FieldLabel>
            <Input
              id="filter-stock-interne-min"
              type="number"
              value={draft.stock_interne_min ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  stock_interne_min: toNumberOrUndefined(event.target.value),
                }))
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-stock-interne-max">Interne MAX</FieldLabel>
            <Input
              id="filter-stock-interne-max"
              type="number"
              value={draft.stock_interne_max ?? ""}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  stock_interne_max: toNumberOrUndefined(event.target.value),
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
