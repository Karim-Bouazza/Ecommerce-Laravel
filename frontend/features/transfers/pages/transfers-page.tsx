import { TransfersTable } from "@/features/transfers/components/transfers-table"

type TransfersPageProps = {
  initialWarehouseId?: number | null
}

export function TransfersPage({ initialWarehouseId = null }: TransfersPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <TransfersTable initialWarehouseId={initialWarehouseId} />
    </div>
  )
}
