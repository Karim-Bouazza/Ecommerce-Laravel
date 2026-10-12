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
import type { OrderAnalysisDateBasis, OrderAnalysisFilters } from "@/features/order-analysis/types"
import { useProductOptions } from "@/features/products/hooks/use-product-options"
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

const dateBasisLabels: Record<OrderAnalysisDateBasis, string> = {
  created_at: "Par date de création",
  status_changed_at: "Par date de changement de statut",
}

export type ComingSoonFilter = { label: string; placeholder: string }

const DEFAULT_COMING_SOON_FILTERS: ComingSoonFilter[] = [
  { label: "Canaux de vente", placeholder: "Tous les canaux" },
  { label: "Agent", placeholder: "Tous les agents" },
  { label: "Agent de suivi", placeholder: "Tous les agents de suivi" },
  { label: "Marketer", placeholder: "Tous les marketers" },
]

type OrderAnalysisFiltersSheetProps<T extends OrderAnalysisFilters> = {
  value: T
  onApply: (value: T) => void
  /** Filters not computable yet, shown disabled. */
  comingSoon?: ComingSoonFilter[]
  /** Page-specific fields rendered after the shared ones. */
  extraFields?: (draft: T, update: (patch: Partial<T>) => void) => React.ReactNode
}

export function OrderAnalysisFiltersSheet<T extends OrderAnalysisFilters = OrderAnalysisFilters>({
  value,
  onApply,
  comingSoon = DEFAULT_COMING_SOON_FILTERS,
  extraFields,
}: OrderAnalysisFiltersSheetProps<T>) {
  const emptyFilters = {} as T
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<T>(value)
  const { data: products = [] } = useProductOptions()
  const { data: wilayas = [] } = useWilayas()

  const activeCount = Object.entries(value).filter(
    ([key, entry]) => entry !== undefined && key !== "date_basis"
  ).length

  const update = (patch: Partial<T> | OrderAnalysisFilters) =>
    setDraft((current) => ({ ...current, ...patch }))

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
              onValueChange={(next) => update({ date_basis: next as OrderAnalysisDateBasis })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(selected: OrderAnalysisDateBasis) => dateBasisLabels[selected]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(dateBasisLabels) as OrderAnalysisDateBasis[]).map((basis) => (
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

          <Field>
            <FieldLabel>Wilaya</FieldLabel>
            <Select
              value={draft.wilaya_id ? String(draft.wilaya_id) : undefined}
              onValueChange={(next) => update({ wilaya_id: Number(next) })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Toutes les wilayas" />
              </SelectTrigger>
              <SelectContent>
                {wilayas.map((wilaya) => (
                  <SelectItem key={wilaya.id} value={String(wilaya.id)}>
                    {wilaya.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {comingSoon.map((filter) => (
            <Field key={filter.label}>
              <FieldLabel className="flex items-center gap-2">
                {filter.label}
                <span className="text-xs text-muted-foreground">(bientôt)</span>
              </FieldLabel>
              <Select disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent />
              </Select>
            </Field>
          ))}

          {extraFields?.(draft, update)}
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
