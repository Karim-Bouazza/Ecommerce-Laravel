"use client"

import * as React from "react"

import { DataTable } from "@/components/data-table/data-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { FraudDetailDialog } from "@/features/fraud/components/fraud-detail-dialog"
import { createFraudColumns } from "@/features/fraud/components/fraud-columns"
import { useFraudAssessments } from "@/features/fraud/hooks/use-fraud"
import type { ReviewLabel, RiskLevel } from "@/features/fraud/types"

const selectClass = "h-9 rounded-md border bg-background px-2 text-sm"

export function FraudPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(15)
  const [riskLevel, setRiskLevel] = React.useState<RiskLevel | "">("")
  const [reviewLabel, setReviewLabel] = React.useState<ReviewLabel | "">("")
  const [selected, setSelected] = React.useState<number | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  const { data, isPending, isFetching, refetch } = useFraudAssessments({
    page,
    per_page: perPage,
    search: debouncedSearch || undefined,
    risk_level: riskLevel || undefined,
    review_label: reviewLabel || undefined,
  })

  const columns = React.useMemo(() => createFraudColumns(setSelected), [])

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending}
        emptyMessage="Aucune évaluation."
        search={{ value: search, onChange: (value: string) => {
            setSearch(value)
            setPage(1)
          }, placeholder: "Rechercher Réf, Téléphone" }}
        onRefresh={() => refetch()}
        toolbarActions={
          <div className="flex gap-2">
            <select
              aria-label="Niveau de risque"
              className={selectClass}
              value={riskLevel}
              onChange={(e) => {
                setRiskLevel(e.target.value as RiskLevel | "")
                setPage(1)
              }}
            >
              <option value="">Tous les risques</option>
              <option value="LOW">Faible</option>
              <option value="MEDIUM">Moyen</option>
              <option value="HIGH">Élevé</option>
              <option value="CRITICAL">Critique</option>
            </select>
            <select
              aria-label="Vérification"
              className={selectClass}
              value={reviewLabel}
              onChange={(e) => {
                setReviewLabel(e.target.value as ReviewLabel | "")
                setPage(1)
              }}
            >
              <option value="">Toutes les vérifications</option>
              <option value="UNKNOWN">Non vérifiée</option>
              <option value="LEGITIMATE">Légitime</option>
              <option value="CONFIRMED_FAKE">Fausse confirmée</option>
            </select>
          </div>
        }
        pagination={{
          pageIndex: data?.meta.current_page ?? page,
          pageCount: data?.meta.last_page ?? 1,
          pageSize: perPage,
          total: data?.meta.total ?? 0,
          onPageIndexChange: setPage,
          onPageSizeChange: (size: number) => {
            setPerPage(size)
            setPage(1)
          },
        }}
        className={isFetching ? "opacity-70 transition-opacity" : undefined}
      />
      <FraudDetailDialog orderId={selected} onClose={() => setSelected(null)} />
    </>
  )
}
