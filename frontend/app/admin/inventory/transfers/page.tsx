"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { TransfersPage } from "@/features/transfers/pages/transfers-page"

function TransfersContent() {
  const searchParams = useSearchParams()
  const warehouseIdParam = searchParams.get("warehouse_id")
  const warehouseId = warehouseIdParam ? Number(warehouseIdParam) : null

  return <TransfersPage initialWarehouseId={warehouseId} />
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TransfersContent />
    </Suspense>
  )
}
