"use client"

import * as React from "react"
import { HelpCircle, UserCheck, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToggleClientBlacklist } from "@/features/clients/hooks/use-toggle-client-blacklist"
import type { Client } from "@/features/clients/types"

type ToggleBlacklistDialogProps = {
  client: Client
}

export function ToggleBlacklistDialog({ client }: ToggleBlacklistDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useToggleClientBlacklist(client.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          client.is_blacklisted ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Retirer de la liste noire"
              className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ajouter à la liste noire"
              className="text-destructive hover:text-destructive"
            />
          )
        }
      >
        {client.is_blacklisted ? <UserCheck className="size-4" /> : <UserX className="size-4" />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer le client</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              Ceci mettra à jour le statut de liste noire du client.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button type="button" disabled={isPending} onClick={() => mutate()}>
            {isPending ? "Mise à jour…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
