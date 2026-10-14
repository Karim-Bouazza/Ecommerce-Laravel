"use client"

import * as React from "react"
import { ShieldOff, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAbility } from "@/features/auth/lib/ability-provider"
import { useDeleteExcludedIp, useExcludedIps } from "@/features/fraud/hooks/use-excluded-ips"
import type { ExcludedIp, ExcludedIpType } from "@/features/fraud/types"

const TYPE_LABELS: Record<ExcludedIpType, string> = {
  exact: "Exacte",
  wildcard: "Joker",
  cidr: "CIDR",
}

function DeleteButton({ entry }: { entry: ExcludedIp }) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useDeleteExcludedIp(entry.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Retirer ${entry.pattern}`}
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retirer cette adresse ?</DialogTitle>
          <DialogDescription>
            Les achats depuis <span className="font-mono font-medium text-foreground">{entry.pattern}</span> seront de
            nouveau envoyés aux pixels.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" disabled={isPending} onClick={() => mutate()}>
            {isPending ? "Suppression…" : "Retirer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExcludedIpList() {
  const ability = useAbility()
  const canDelete = ability.can("delete", "pixels")
  const { data, isPending, isError, refetch } = useExcludedIps()

  if (isPending) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 rounded-md border border-destructive/30 p-4 text-sm">
        <p>Impossible de charger la liste.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Réessayer
        </Button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-10 text-center">
        <ShieldOff className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">Aucune adresse exclue</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ajoutez une IP ou un motif comme 123.32.58.* : ces visiteurs pourront commander, sans déclencher
          l&apos;événement d&apos;achat des pixels.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Adresse / motif</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Ajoutée le</TableHead>
            {canDelete && (
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono font-medium">{entry.pattern}</TableCell>
              <TableCell>
                <Badge variant="outline">{TYPE_LABELS[entry.type]}</Badge>
              </TableCell>
              <TableCell className="max-w-64 truncate text-muted-foreground" title={entry.note ?? undefined}>
                {entry.note ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                {entry.created_at ? new Date(entry.created_at).toLocaleDateString("fr-FR") : "—"}
              </TableCell>
              {canDelete && (
                <TableCell>
                  <DeleteButton entry={entry} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
