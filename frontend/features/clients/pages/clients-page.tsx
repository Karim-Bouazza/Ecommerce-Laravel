import { ClientsTable } from "@/features/clients/components/clients-table"

export function ClientsPage() {
  return (
    <div className="flex flex-col gap-4">
      <ClientsTable />
    </div>
  )
}
