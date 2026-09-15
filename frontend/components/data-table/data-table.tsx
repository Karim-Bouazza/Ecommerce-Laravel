"use client"

import * as React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { RotateCw, Search } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DataTablePagination,
  type DataTablePaginationProps,
} from "@/components/data-table/data-table-pagination"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right"
    /** Extra classes for the header/cell, e.g. a width utility like "w-1/3". */
    className?: string
    /** Pins the column to the right edge, staying visible while other columns scroll. Requires `stickyWidth`. */
    sticky?: "right"
    /** Fixed pixel width of a sticky column, used to compute the offset of columns pinned before it. */
    stickyWidth?: number
  }
}

function getStickyRightOffset(
  headers: { column: { columnDef: { meta?: { sticky?: "right"; stickyWidth?: number } } } }[],
  index: number
): number {
  let offset = 0
  for (let i = index + 1; i < headers.length; i++) {
    const meta = headers[i].column.columnDef.meta
    if (meta?.sticky === "right") {
      offset += meta.stickyWidth ?? 0
    }
  }
  return offset
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

export type DataTableSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage?: string
  search?: DataTableSearchProps
  /** Extra controls rendered at the end of the toolbar (e.g. create/transfer buttons). */
  toolbarActions?: React.ReactNode
  onRefresh?: () => void
  pagination?: DataTablePaginationProps
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  emptyMessage = "Aucun résultat.",
  search,
  toolbarActions,
  onRefresh,
  pagination,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const showToolbar = Boolean(search || toolbarActions || onRefresh)

  return (
    <Card className={cn("gap-4", className)}>
      <CardContent className="flex flex-col gap-4">
        {showToolbar && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {search ? (
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search.value}
                  onChange={(event) => search.onChange(event.target.value)}
                  placeholder={search.placeholder ?? "Rechercher"}
                  className="pl-8"
                />
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {toolbarActions}
              {onRefresh && (
                <Button variant="outline" size="icon" onClick={onRefresh} aria-label="Actualiser">
                  <RotateCw className="size-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <colgroup>
              {table.getHeaderGroups()[0]?.headers.map((header) => {
                const meta = header.column.columnDef.meta
                const width = meta?.sticky === "right" ? meta.stickyWidth : undefined

                return (
                  <col
                    key={header.id}
                    style={width !== undefined ? { width, minWidth: width, maxWidth: width } : undefined}
                  />
                )
              })}
            </colgroup>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    const meta = header.column.columnDef.meta
                    const isSticky = meta?.sticky === "right"

                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "bg-muted/50 text-muted-foreground",
                          alignClass[meta?.align ?? "center"],
                          meta?.className,
                          isSticky && "sticky z-10 border-l bg-muted"
                        )}
                        style={
                          isSticky
                            ? {
                                right: getStickyRightOffset(headerGroup.headers, index),
                                width: meta?.stickyWidth,
                                minWidth: meta?.stickyWidth,
                              }
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Chargement…
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell, index) => {
                      const meta = cell.column.columnDef.meta
                      const isSticky = meta?.sticky === "right"

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            alignClass[meta?.align ?? "center"],
                            meta?.className,
                            isSticky && "sticky z-10 border-l bg-background"
                          )}
                          style={
                            isSticky
                              ? {
                                  right: getStickyRightOffset(row.getVisibleCells(), index),
                                  width: meta?.stickyWidth,
                                  minWidth: meta?.stickyWidth,
                                }
                              : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && <DataTablePagination {...pagination} />}
      </CardContent>
    </Card>
  )
}
