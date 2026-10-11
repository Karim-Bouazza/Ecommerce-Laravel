"use client"

import * as React from "react"
import { format } from "date-fns"
import { Filter, Info } from "lucide-react"

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
import type { PerformanceDateBasis, PerformanceFilters } from "@/features/performance/types"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useWarehouseOptions } from "@/features/warehouses/hooks/use-warehouse-options"

const dateBasisLabels: Record<PerformanceDateBasis, string> = {
  created_at: "Par date de création",
  status_changed_at: "Par date de changement de statut",
}

const emptyFilters: PerformanceFilters = {}

function ComingSoonSelect({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <Field>
      <FieldLabel className="flex items-center gap-2">
        {label}
        <span className="text-xs text-muted-foreground">(bientôt)</span>
      </FieldLabel>
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent />
      </Select>
    </Field>
  )
}

type PerformanceFiltersSheetProps = {
  value: PerformanceFilters
  onApply: (value: PerformanceFilters) => void
}

export function PerformanceFiltersSheet({ value, onApply }: PerformanceFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<PerformanceFilters>(value)
  const { data: products = [] } = useProductOptions()
  const { data: warehouses = [] } = useWarehouseOptions()

  const activeCount = Object.entries(value).filter(
    ([key, entry]) => entry !== undefined && key !== "date_basis"
  ).length

  const update = (patch: PerformanceFilters) => setDraft((current) => ({ ...current, ...patch }))

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setDraft(value)
      }}
    >
      <SheetTrigger
        render={
          <Button
            variant="outline"
            aria-label={activeCount > 0 ? `Filtres, ${activeCount} actif(s)` : "Filtres"}
          />
        }
      >
        <Filter className="size-4" aria-hidden />
        Filtres
        {activeCount > 0 ? (
          <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground tabular-nums">
            {activeCount}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>

        <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-4">
          <Field>
            <FieldLabel>Base de la date</FieldLabel>
            <Select
              value={draft.date_basis ?? "created_at"}
              onValueChange={(next) => update({ date_basis: next as PerformanceDateBasis })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(selected: PerformanceDateBasis) => dateBasisLabels[selected]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(dateBasisLabels) as PerformanceDateBasis[]).map((basis) => (
                  <SelectItem key={basis} value={basis}>
                    {dateBasisLabels[basis]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Date début</FieldLabel>
            <DatePicker
              value={draft.date_from ? new Date(draft.date_from) : undefined}
              onChange={(date) => update({ date_from: date ? format(date, "yyyy-MM-dd") : undefined })}
            />
          </Field>

          <Field>
            <FieldLabel>Date fin</FieldLabel>
            <DatePicker
              value={draft.date_to ? new Date(draft.date_to) : undefined}
              onChange={(date) => update({ date_to: date ? format(date, "yyyy-MM-dd") : undefined })}
            />
          </Field>

          <Field>
            <FieldLabel>Produits</FieldLabel>
            <Select
              value={draft.product_id ? String(draft.product_id) : undefined}
              onValueChange={(next) => update({ product_id: Number(next) })}
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

          <ComingSoonSelect label="Marketer" placeholder="Tous les marketers" />

          <div className="flex items-start gap-2 rounded-lg border-l-4 border-amber-400 bg-amber-500/10 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
            Les filtres ci-dessous ne s&apos;appliquent pas aux charges, bénéfices et ROI.
          </div>

          <Field>
            <FieldLabel>Entrepôt</FieldLabel>
            <Select
              value={draft.warehouse_id ? String(draft.warehouse_id) : undefined}
              onValueChange={(next) => update({ warehouse_id: Number(next) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les entrepôts" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <ComingSoonSelect label="Canaux de vente" placeholder="Tous les canaux" />
          <ComingSoonSelect label="Source UTM" placeholder="Toutes les sources" />
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
