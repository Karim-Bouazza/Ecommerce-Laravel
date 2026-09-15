import { BlacklistedClientsTable } from "@/features/clients/components/blacklisted-clients-table"

export function BlacklistPage() {
  return (
    <div className="flex flex-col gap-4">
      <BlacklistedClientsTable />
    </div>
  )
}
