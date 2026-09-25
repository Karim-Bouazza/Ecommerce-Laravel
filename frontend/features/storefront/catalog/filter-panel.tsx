"use client"

import { useState, type KeyboardEvent, type ReactNode } from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  Funnel,
  LayoutGrid,
  PackageCheck,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"
import { cn } from "cn"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { AVAILABILITY_OPTIONS, PRICE_STEP, type FilterOption } from "./catalog-data"
import type { CatalogFiltersApi, FacetKey } from "./use-catalog-filters"

const numberFormat = new Intl.NumberFormat("fr-FR")

/* ------------------------------------------------------------------ */
/* Header & footer                                                     */
/* ------------------------------------------------------------------ */

export function FilterHeader({
  api,
  title = <h2 className="text-sm font-semibold">Filtres</h2>,
  action,
}: {
  api: CatalogFiltersApi
  title?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <SlidersHorizontal className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        {title}
      </div>
      <button
        type="button"
        onClick={api.clearAll}
        disabled={api.activeCount === 0}
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border px-2.5 text-xs font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
      >
        <RotateCcw className="size-3.5" />
        Réinitialiser
      </button>
      {action}
    </div>
  )
}

export const showResultsButtonClass =
  "flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-[background-color,scale] outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"

export function ShowResultsLabel({ count }: { count: number }) {
  return (
    <>
      <Funnel className="size-4" />
      {count === 0 ? "Aucun produit" : `Afficher ${count} produit${count > 1 ? "s" : ""}`}
      <ArrowRight className="size-4" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

function FilterSection({
  title,
  icon: SectionIcon,
  selectedCount = 0,
  defaultOpen = true,
  children,
}: {
  title: string
  icon: typeof LayoutGrid
  selectedCount?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    // A collapsed section that holds an active filter starts open so the selection stays visible.
    <Collapsible.Root
      defaultOpen={defaultOpen || selectedCount > 0}
      className="border-b border-border px-4 last:border-b-0"
    >
      <Collapsible.Trigger className="group flex w-full items-center gap-2 py-3 text-left outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring">
        <SectionIcon className="size-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-semibold text-foreground">{title}</span>
        {selectedCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
            {selectedCount}
          </span>
        )}
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-panel-open:rotate-180" />
      </Collapsible.Trigger>
      <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="pb-3.5">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}

function Count({ value }: { value: number }) {
  return <span className="text-xs tabular-nums text-muted-foreground">({value})</span>
}

/* ------------------------------------------------------------------ */
/* Option lists                                                        */
/* ------------------------------------------------------------------ */

function CheckboxList({
  facet,
  options,
  api,
  hideCount = false,
}: {
  facet: FacetKey
  options: FilterOption[]
  api: CatalogFiltersApi
  hideCount?: boolean
}) {
  const selected = api.filters[facet]

  return (
    <ul className="-mx-2 space-y-0.5">
      {options.map((option) => {
        const checked = selected.includes(option.value)
        const count = api.counts[facet][option.value] ?? 0
        const disabled = !hideCount && !checked && count === 0

        return (
          <li key={option.value}>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                checked ? "bg-primary/8" : "hover:bg-muted/70",
                disabled && "pointer-events-none opacity-40"
              )}
            >
              <Checkbox
                checked={checked}
                disabled={disabled}
                onCheckedChange={() => api.toggleValue(facet, option.value)}
                className="size-4 rounded-[4px]"
              />
              <span className={cn("flex-1 truncate", checked ? "font-medium text-foreground" : "text-foreground/80")}>
                {option.label}
              </span>
              {!hideCount && <Count value={count} />}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/* Price                                                               */
/* ------------------------------------------------------------------ */

function PriceInput({
  label,
  value,
  onCommit,
}: {
  label: string
  value: number
  onCommit: (value: number) => void
}) {
  // While focused the raw digits are editable; otherwise show the formatted amount.
  const [text, setText] = useState<string | null>(null)

  function commit() {
    if (text !== null && text !== "") onCommit(Number(text))
    setText(null)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.currentTarget.blur()
    if (event.key === "Escape") {
      setText(null)
      event.currentTarget.blur()
    }
  }

  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <span className="flex h-10 items-center gap-1 rounded-lg border border-border bg-muted/30 px-3 transition-colors focus-within:border-primary focus-within:bg-background focus-within:ring-3 focus-within:ring-primary/15">
        <input
          inputMode="numeric"
          value={text ?? numberFormat.format(value)}
          onFocus={(event) => {
            setText(String(value))
            requestAnimationFrame(() => event.target.select())
          }}
          onChange={(event) => setText(event.target.value.replace(/\D/g, ""))}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full min-w-0 bg-transparent text-sm font-medium tabular-nums outline-none"
        />
        <span className="text-xs text-muted-foreground">DZD</span>
      </span>
    </label>
  )
}

function PriceRange({
  bounds,
  value,
  onCommit,
}: {
  bounds: [number, number]
  value: [number, number]
  onCommit: (value: [number, number]) => void
}) {
  // Local draft keeps dragging smooth; the URL only updates on release / blur.
  const [draft, setDraft] = useState(value)

  function commitBound(index: 0 | 1, amount: number) {
    const [lo, hi] = bounds
    const clamped = Math.min(Math.max(amount, lo), hi)
    const next: [number, number] =
      index === 0
        ? [Math.min(clamped, draft[1] - PRICE_STEP), draft[1]]
        : [draft[0], Math.max(clamped, draft[0] + PRICE_STEP)]
    setDraft(next)
    onCommit(next)
  }

  return (
    <div className="space-y-4">
      <div className="px-1 pt-1">
        <Slider
          value={draft}
          min={bounds[0]}
          max={bounds[1]}
          step={PRICE_STEP}
          minStepsBetweenValues={1}
          onValueChange={(next) => setDraft(next as [number, number])}
          onValueCommitted={(next) => onCommit(next as [number, number])}
          getThumbAriaLabel={(index) => (index === 0 ? "Prix minimum" : "Prix maximum")}
        />
      </div>
      <div className="flex items-end gap-2">
        <PriceInput label="Min" value={draft[0]} onCommit={(amount) => commitBound(0, amount)} />
        <span className="mb-5 h-px w-2.5 shrink-0 bg-muted-foreground/40" aria-hidden />
        <PriceInput label="Max" value={draft[1]} onCommit={(amount) => commitBound(1, amount)} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

export function FilterPanel({ api }: { api: CatalogFiltersApi }) {
  const price = api.filters.price ?? api.priceBounds
  const categoryOptions: FilterOption[] = api.categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }))

  return (
    <div>
      <FilterSection title="Catégorie" icon={LayoutGrid} selectedCount={api.filters.category.length}>
        {categoryOptions.length > 0 ? (
          <CheckboxList facet="category" options={categoryOptions} api={api} />
        ) : (
          <p className="py-2 text-center text-xs text-muted-foreground">Aucune catégorie</p>
        )}
      </FilterSection>

      <FilterSection title="Prix" icon={Banknote} selectedCount={api.filters.price ? 1 : 0}>
        {/* Remount when the committed range or bounds change externally (chip removed, reset). */}
        <PriceRange
          key={`${price.join("-")}-${api.priceBounds.join("-")}`}
          bounds={api.priceBounds}
          value={price}
          onCommit={(next) => api.setPrice(next, api.priceBounds)}
        />
      </FilterSection>

      <FilterSection
        title="Disponibilité"
        icon={PackageCheck}
        selectedCount={api.filters.availability.length}
        defaultOpen={false}
      >
        <CheckboxList facet="availability" options={AVAILABILITY_OPTIONS} api={api} hideCount />
      </FilterSection>
    </div>
  )
}
