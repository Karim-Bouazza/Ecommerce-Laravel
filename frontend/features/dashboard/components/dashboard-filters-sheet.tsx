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
import { useWilayas } from "@/features/wilayas/hooks/use-wilayas"

export type DashboardFiltersValue = {
  date_from?: string
  date_to?: string
  wilaya_id?: number
  product_id?: number
}

const emptyFilters: DashboardFiltersValue = {}

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

type DashboardFiltersSheetProps = {
  value: DashboardFiltersValue
  onApply: (value: DashboardFiltersValue) => void
}

export function DashboardFiltersSheet({ value, onApply }: DashboardFiltersSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DashboardFiltersValue>(value)
  const { data: wilayas = [] } = useWilayas()
  const { data: products = [] } = useProductOptions()

  const activeCount = Object.values(value).filter((entry) => entry !== undefined).length

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
        {activeCount > 0 ? (
          <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeCount}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>

        <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-4">
          <ComingSoonSelect
            label="Par date de changement de statut"
            placeholder="Date de création"
          />

          <Field>
            <FieldLabel>Date début</FieldLabel>
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
            <FieldLabel>Date fin</FieldLabel>
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

          <ComingSoonSelect label="Canaux de vente" placeholder="Tous les canaux" />
          <ComingSoonSelect label="Agent" placeholder="Tous les agents" />
          <ComingSoonSelect label="Agent de suivi" placeholder="Tous les agents de suivi" />

          <Field>
            <FieldLabel>Wilaya</FieldLabel>
            <Select
              value={draft.wilaya_id ? String(draft.wilaya_id) : undefined}
              onValueChange={(next) =>
                setDraft((current) => ({ ...current, wilaya_id: Number(next) }))
              }
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

          <ComingSoonSelect label="Marketer" placeholder="Tous les marketers" />
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
