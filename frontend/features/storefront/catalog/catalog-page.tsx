"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/shared/lib/format-price";
import { AVAILABILITY_OPTIONS, SORT_OPTIONS, type SortValue } from "./catalog-data";
import {
  FilterHeader,
  FilterPanel,
  ShowResultsLabel,
  showResultsButtonClass,
} from "./filter-panel";
import { ProductCard } from "./product-card";
import { useCatalogFilters, type CatalogFiltersApi } from "./use-catalog-filters";

function ActiveFilters({ api }: { api: CatalogFiltersApi }) {
  const { filters } = api;
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.search) {
    chips.push({
      key: "search",
      label: `« ${filters.search} »`,
      onRemove: api.clearSearch,
    });
  }
  for (const categoryId of filters.category) {
    const label =
      api.categories.find((c) => String(c.id) === categoryId)?.name ?? categoryId;
    chips.push({
      key: `category-${categoryId}`,
      label,
      onRemove: () => api.toggleValue("category", categoryId),
    });
  }
  for (const value of filters.availability) {
    const label = AVAILABILITY_OPTIONS.find((o) => o.value === value)?.label ?? value;
    chips.push({
      key: `availability-${value}`,
      label,
      onRemove: () => api.toggleValue("availability", value),
    });
  }
  if (filters.price) {
    chips.push({
      key: "price",
      label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`,
      onRemove: () => api.setPrice(api.priceBounds, api.priceBounds),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Retirer le filtre ${chip.label}`}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-background py-1.5 pr-2.5 pl-3.5 text-sm transition-colors hover:border-foreground/30 hover:bg-muted"
        >
          {chip.label}
          <X className="size-3.5 text-muted-foreground group-hover:text-foreground" />
        </button>
      ))}
      <button
        type="button"
        onClick={api.clearAll}
        className="px-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Tout effacer
      </button>
    </div>
  );
}

function MobileFilters({ api }: { api: CatalogFiltersApi }) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-muted lg:hidden">
        <SlidersHorizontal className="size-4" />
        Filtres
        {api.activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {api.activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-full gap-0 p-0 sm:max-w-sm"
      >
        <FilterHeader
          api={api}
          title={
            <SheetTitle className="text-base font-semibold">Filtres</SheetTitle>
          }
          action={
            <SheetClose
              aria-label="Fermer les filtres"
              className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </SheetClose>
          }
        />
        <div className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <FilterPanel api={api} />
        </div>
        <SheetFooter className="border-t border-border p-3">
          <SheetClose className={showResultsButtonClass}>
            <ShowResultsLabel count={api.total} />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SortSelect({ api }: { api: CatalogFiltersApi }) {
  const labelOf = (value: string | null) =>
    SORT_OPTIONS.find((o) => o.value === value)?.label ?? SORT_OPTIONS[0].label;

  return (
    <Select
      value={api.filters.sort}
      onValueChange={(value) => api.setSort(value as SortValue)}
    >
      <SelectTrigger
        aria-label="Trier par"
        className="h-10 min-w-48 rounded-full px-4"
      >
        <span className="text-muted-foreground">Trier :</span>
        <SelectValue>{(value: string | null) => labelOf(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-6 text-muted-foreground" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">Aucun produit trouvé</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Essayez d&apos;élargir votre recherche ou de retirer certains filtres
        pour voir plus de résultats.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}

function Pagination({ api }: { api: CatalogFiltersApi }) {
  if (api.lastPage <= 1) return null;
  const page = api.filters.page;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => api.setPage(page - 1)}
        aria-label="Page précédente"
        className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> / {api.lastPage}
      </span>
      <button
        type="button"
        disabled={page >= api.lastPage}
        onClick={() => api.setPage(page + 1)}
        aria-label="Page suivante"
        className="flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export function CatalogPage() {
  const api = useCatalogFilters();

  return (
    <main className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Accueil
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Produits</span>
      </nav>

      <div className="mt-6 lg:grid lg:grid-cols-[264px_1fr] lg:gap-8">
        <aside
          aria-label="Filtres"
          className="hidden rounded-2xl border border-border bg-card pb-1 shadow-xs lg:block lg:self-start"
        >
          <FilterHeader api={api} />
          <FilterPanel api={api} />
        </aside>

        <section
          id="catalog-results"
          aria-label="Liste des produits"
          className="scroll-mt-24"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <MobileFilters api={api} />
              <p className="text-sm text-muted-foreground" aria-live="polite">
                <span className="font-semibold text-foreground">{api.total}</span>{" "}
                {api.total > 1 ? "produits" : "produit"}
              </p>
            </div>
            <SortSelect api={api} />
          </div>

          <ActiveFilters api={api} />

          {api.products.length > 0 ? (
            <div
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5 data-fetching:opacity-60"
              data-fetching={api.isFetching || undefined}
            >
              {api.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !api.isLoading ? (
            <EmptyState onReset={api.clearAll} />
          ) : null}

          <Pagination api={api} />
        </section>
      </div>
    </main>
  );
}
