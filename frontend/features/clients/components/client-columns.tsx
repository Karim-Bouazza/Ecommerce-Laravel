"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Phone } from "lucide-react"

import { DeleteClientDialog } from "@/features/clients/components/delete-client-dialog"
import { EditClientDialog } from "@/features/clients/components/edit-client-dialog"
import { ToggleBlacklistDialog } from "@/features/clients/components/toggle-blacklist-dialog"
import type { Client } from "@/features/clients/types"

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "full_name",
    header: "Nom",
  },
  {
    accessorKey: "phone_number",
    header: "Téléphone",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <span>{row.original.phone_number}</span>
        <Phone className="size-4 text-muted-foreground" />
      </div>
    ),
  },
  {
    accessorKey: "wilaya",
    header: "Wilaya",
    cell: ({ row }) => row.original.wilaya ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "commune",
    header: "Adresse",
    cell: ({ row }) => row.original.commune ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <EditClientDialog client={row.original} />
        <ToggleBlacklistDialog client={row.original} />
        <DeleteClientDialog client={row.original} />
      </div>
    ),
  },
]
