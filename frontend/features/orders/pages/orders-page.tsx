import { OrdersTable } from "@/features/orders/components/orders-table"
import type { OrderStatusGroup } from "@/features/orders/types"

type OrdersPageProps = {
  statusGroup?: OrderStatusGroup
}

export function OrdersPage({ statusGroup }: OrdersPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <OrdersTable statusGroup={statusGroup} />
    </div>
  )
}
