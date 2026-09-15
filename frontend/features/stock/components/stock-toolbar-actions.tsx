"use client"

import type * as React from "react"
import { ScanBarcode } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StockFiltersSheet, type StockFiltersValue } from "@/features/stock/components/stock-filters-sheet"

function ComingSoonDialog({
  title,
  trigger,
}: {
  title: string
  trigger: React.ReactElement
}) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="py-2 text-center text-sm text-muted-foreground">(bientôt)</p>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Fermer</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type StockToolbarActionsProps = {
  filters: StockFiltersValue
  onFiltersChange: (filters: StockFiltersValue) => void
}

export function StockToolbarActions({ filters, onFiltersChange }: StockToolbarActionsProps) {
  return (
    <>
      <StockFiltersSheet value={filters} onApply={onFiltersChange} />
      <ComingSoonDialog
        title="Scanner le Stock"
        trigger={
          <Button>
            <ScanBarcode className="size-4" />
            Scanner le Stock
          </Button>
        }
      />
    </>
  )
}
