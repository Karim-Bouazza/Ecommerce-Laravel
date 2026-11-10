"use client"

import { StockFiltersSheet, type StockFiltersValue } from "@/features/stock/components/stock-filters-sheet"

type StockToolbarActionsProps = {
  filters: StockFiltersValue
  onFiltersChange: (filters: StockFiltersValue) => void
}

export function StockToolbarActions({ filters, onFiltersChange }: StockToolbarActionsProps) {
  return <StockFiltersSheet value={filters} onApply={onFiltersChange} />
}
