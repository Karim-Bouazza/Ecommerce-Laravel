import { TransfersPage } from "@/features/transfers/pages/transfers-page"

type PageProps = {
  searchParams: Promise<{ warehouse_id?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const warehouseId = params.warehouse_id ? Number(params.warehouse_id) : null

  return <TransfersPage initialWarehouseId={warehouseId} />
}
