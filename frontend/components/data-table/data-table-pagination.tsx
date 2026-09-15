"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type DataTablePaginationProps = {
  /** 1-based current page */
  pageIndex: number
  pageCount: number
  pageSize: number
  total: number
  onPageIndexChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export function DataTablePagination({
  pageIndex,
  pageCount,
  pageSize,
  total,
  onPageIndexChange,
  onPageSizeChange,
  pageSizeOptions = [15, 25, 50, 100],
  className,
}: DataTablePaginationProps) {
  const [goToValue, setGoToValue] = React.useState(String(pageIndex))

  React.useEffect(() => {
    setGoToValue(String(pageIndex))
  }, [pageIndex])

  const canGoPrev = pageIndex > 1
  const canGoNext = pageIndex < pageCount

  function commitGoTo() {
    const page = Number(goToValue)
    if (!Number.isFinite(page)) {
      setGoToValue(String(pageIndex))
      return
    }
    const clamped = Math.min(Math.max(Math.trunc(page), 1), Math.max(pageCount, 1))
    setGoToValue(String(clamped))
    if (clamped !== pageIndex) onPageIndexChange(clamped)
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 text-sm", className)}>
      <span className="text-muted-foreground">Total {total}</span>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!canGoPrev}
            onClick={() => onPageIndexChange(pageIndex - 1)}
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
            {pageIndex}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!canGoNext}
            onClick={() => onPageIndexChange(pageIndex + 1)}
            aria-label="Page suivante"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger size="sm" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Go to</span>
          <Input
            value={goToValue}
            onChange={(event) => setGoToValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitGoTo()
            }}
            onBlur={commitGoTo}
            className="h-7 w-14 px-2 text-center"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  )
}
