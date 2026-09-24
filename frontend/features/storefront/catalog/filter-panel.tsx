"use client"

import { useState, type ComponentType, type KeyboardEvent, type ReactNode } from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight,
  Banknote,
  Cctv,
  Check,
  ChevronDown,
  Fingerprint,
  Funnel,
  LayoutGrid,
  PackageCheck,
  Palette,
  Radar,
  RotateCcw,
  Search,
  Siren,
  SlidersHorizontal,
  Star,
  TabletSmartphone,
  Tag,
  Wifi,
  type LucideProps,
} from "lucide-react"
import { cn } from "cn"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  AVAILABILITY_OPTIONS,
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  COLOR_OPTIONS,
  CONNECTIVITY_OPTIONS,
  PRICE_BOUNDS,
  PRICE_STEP,
  RATING_OPTIONS,
  type FilterOption,
} from "./catalog-data"
import type { CatalogFiltersApi, FacetKey } from "./use-catalog-filters"

type Icon = ComponentType<LucideProps>

const CATEGORY_ICONS: Record<string, Icon> = {
  "cctv-cameras": Cctv,
  "alarm-systems": Siren,
  "access-control": Fingerprint,
  "video-intercoms": TabletSmartphone,
  "sensors-detectors": Radar,
}

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
  icon: Icon
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
  icons,
}: {
  facet: FacetKey
  options: FilterOption[]
  api: CatalogFiltersApi
  icons?: Record<string, Icon>
}) {
  const selected = api.filters[facet]

  return (
    <ul className="-mx-2 space-y-0.5">
      {options.map((option) => {
        const checked = selected.includes(option.value)
        const count = api.counts[facet][option.value] ?? 0
        const disabled = !checked && count === 0
        const OptionIcon = icons?.[option.value]

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
              {OptionIcon && (
                <OptionIcon
                  className={cn("size-4 shrink-0", checked ? "text-primary" : "text-muted-foreground")}
                />
              )}
              <span className={cn("flex-1 truncate", checked ? "font-medium text-foreground" : "text-foreground/80")}>
                {option.label}
              </span>
              <Count value={count} />
            </label>
          </li>
        )
      })}
    </ul>
  )
}

function BrandList({ api }: { api: CatalogFiltersApi }) {
  const [query, setQuery] = useState("")
  const normalized = query.trim().toLowerCase()
  const options = normalized
    ? BRAND_OPTIONS.filter((o) => o.label.toLowerCase().includes(normalized))
    : BRAND_OPTIONS

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une marque…"
          aria-label="Rechercher une marque"
          className="h-9 w-full rounded-lg border border-border bg-muted/40 pr-3 pl-9 text-[13px] transition-colors outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-3 focus:ring-primary/15"
        />
      </div>
      {options.length > 0 ? (
        <CheckboxList facet="brand" options={options} api={api} />
      ) : (
        <p className="py-2 text-center text-xs text-muted-foreground">Aucune marque trouvée</p>
      )}
    </div>
  )
}

// Compact toggle pills — better than long lists for short, visual options.
function ChipList({
  facet,
  options,
  api,
  swatches,
}: {
  facet: FacetKey
  options: FilterOption[]
  api: CatalogFiltersApi
  swatches?: Record<string, string>
}) {
  const selected = api.filters[facet]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = selected.includes(option.value)
        const count = api.counts[facet][option.value] ?? 0
        const swatch = swatches?.[option.value]

        return (
          <button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={checked}
            disabled={!checked && count === 0}
            onClick={() => api.toggleValue(facet, option.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
              checked
                ? "border-primary bg-primary/8 font-medium text-foreground"
                : "border-border text-foreground/80 hover:border-foreground/25 hover:bg-muted/60"
            )}
          >
            {swatch && (
              <span
                className="flex size-4 items-center justify-center rounded-full ring-1 ring-black/10 ring-inset"
                style={{ background: swatch }}
              >
                {checked && (
                  <Check
                    strokeWidth={3.5}
                    className={cn(
                      "size-2.5",
                      option.value === "white" || option.value === "silver" ? "text-foreground" : "text-white"
                    )}
                  />
                )}
              </span>
            )}
            {!swatch && checked && <Check strokeWidth={3} className="size-3.5 text-primary" />}
            {option.label}
            <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
          </button>
        )
      })}
    </div>
  )
}

function RatingList({ api }: { api: CatalogFiltersApi }) {
  return (
    <div role="radiogroup" aria-label="Note minimale" className="-mx-2 space-y-0.5">
      {RATING_OPTIONS.map((threshold) => {
        const checked = api.filters.rating === threshold
        const count = api.ratingCounts[threshold] ?? 0

        return (
          <button
            key={threshold}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${numberFormat.format(threshold)} étoiles et plus`}
            disabled={!checked && count === 0}
            // Clicking the active option clears it — radios alone can't be unselected.
            onClick={() => api.setRating(checked ? null : threshold)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
              checked ? "bg-primary/8" : "hover:bg-muted/70"
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                checked ? "border-primary" : "border-muted-foreground/30"
              )}
            >
              {checked && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <span className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-3.5",
                    index < Math.floor(threshold)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  )}
                />
              ))}
            </span>
            <span className={cn("flex-1 text-left", checked ? "font-medium" : "text-foreground/80")}>
              {numberFormat.format(threshold)} et plus
            </span>
            <Count value={count} />
          </button>
        )
      })}
    </div>
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
  value,
  onCommit,
}: {
  value: [number, number]
  onCommit: (value: [number, number]) => void
}) {
  // Local draft keeps dragging smooth; the URL only updates on release / blur.
  const [draft, setDraft] = useState(value)

  function commitBound(index: 0 | 1, amount: number) {
    const [lo, hi] = PRICE_BOUNDS
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
          min={PRICE_BOUNDS[0]}
          max={PRICE_BOUNDS[1]}
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

const COLOR_SWATCHES = Object.fromEntries(COLOR_OPTIONS.map((o) => [o.value, o.swatch]))

export function FilterPanel({ api }: { api: CatalogFiltersApi }) {
  const price = api.filters.price ?? PRICE_BOUNDS

  return (
    <div>
      <FilterSection title="Catégorie" icon={LayoutGrid} selectedCount={api.filters.category.length}>
        <CheckboxList facet="category" options={CATEGORY_OPTIONS} api={api} icons={CATEGORY_ICONS} />
      </FilterSection>

      <FilterSection title="Prix" icon={Banknote} selectedCount={api.filters.price ? 1 : 0}>
        {/* Remount when the committed range changes externally (chip removed, reset). */}
        <PriceRange key={price.join("-")} value={price} onCommit={api.setPrice} />
      </FilterSection>

      <FilterSection title="Marque" icon={Tag} selectedCount={api.filters.brand.length}>
        <BrandList api={api} />
      </FilterSection>

      <FilterSection title="Couleur" icon={Palette} selectedCount={api.filters.color.length} defaultOpen={false}>
        <ChipList facet="color" options={COLOR_OPTIONS} api={api} swatches={COLOR_SWATCHES} />
      </FilterSection>

      <FilterSection
        title="Connectivité"
        icon={Wifi}
        selectedCount={api.filters.connectivity.length}
        defaultOpen={false}
      >
        <ChipList facet="connectivity" options={CONNECTIVITY_OPTIONS} api={api} />
      </FilterSection>

      <FilterSection
        title="Disponibilité"
        icon={PackageCheck}
        selectedCount={api.filters.availability.length}
        defaultOpen={false}
      >
        <CheckboxList facet="availability" options={AVAILABILITY_OPTIONS} api={api} />
      </FilterSection>

      <FilterSection title="Note des clients" icon={Star} selectedCount={api.filters.rating ? 1 : 0} defaultOpen={false}>
        <RatingList api={api} />
      </FilterSection>
    </div>
  )
}
