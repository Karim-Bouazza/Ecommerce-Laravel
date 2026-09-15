"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDeleteClient } from "@/features/clients/hooks/use-delete-client"
import type { Client } from "@/features/clients/types"

type DeleteClientDialogProps = {
  client: Client
}

export function DeleteClientDialog({ client }: DeleteClientDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useDeleteClient(client.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Supprimer"
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le client</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">Vous voulez supprimer ce client</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Suppression…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
