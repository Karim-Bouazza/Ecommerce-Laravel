"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reviewColumns } from "@/features/product-reviews/components/review-columns"
import { useProductReviewList } from "@/features/product-reviews/hooks/use-product-review-list"
import type { GetProductReviewsParams } from "@/features/product-reviews/api/product-review-api"

const ALL_VALUE = "all"

const STATUS_LABELS: Record<string, string> = {
  [ALL_VALUE]: "Tous les statuts",
  pending: "En attente",
  approved: "Approuvé",
}

export function ReviewsTable() {
  const [status, setStatus] = React.useState<GetProductReviewsParams["status"] | typeof ALL_VALUE>(
    ALL_VALUE
  )
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)

  React.useEffect(() => {
    setPage(1)
  }, [status, perPage])

  const { data, isPending, isFetching, refetch } = useProductReviewList({
    page,
    per_page: perPage,
    status: status === ALL_VALUE ? undefined : status,
  })

  return (
    <DataTable
      columns={reviewColumns}
      data={data?.data ?? []}
      isLoading={isPending}
      emptyMessage="Aucun avis."
      onRefresh={() => refetch()}
      toolbarActions={
        <Select value={status} onValueChange={(next) => setStatus(next as typeof status)}>
          <SelectTrigger className="w-44" aria-label="Filtrer par statut">
            <SelectValue>{(val: string) => STATUS_LABELS[val] ?? val}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
          </SelectContent>
        </Select>
      }
      pagination={{
        pageIndex: data?.meta.current_page ?? page,
        pageCount: data?.meta.last_page ?? 1,
        pageSize: perPage,
        total: data?.meta.total ?? 0,
        onPageIndexChange: setPage,
        onPageSizeChange: setPerPage,
      }}
      className={isFetching ? "opacity-70 transition-opacity" : undefined}
    />
  )
}
