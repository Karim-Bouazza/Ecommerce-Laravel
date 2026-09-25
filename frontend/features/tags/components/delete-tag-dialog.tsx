"use client"

import * as React from "react"
import { HelpCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDeleteTag } from "@/features/tags/hooks/use-delete-tag"
import type { Tag } from "@/features/tags/types"

type DeleteTagDialogProps = {
  tag: Tag
}

export function DeleteTagDialog({ tag }: DeleteTagDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useDeleteTag(tag.id, () => setOpen(false))

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
          <DialogTitle>Confirmer l&rsquo;étiquette</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          {tag.has_related_data && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Cette étiquette est associée à {tag.products_count} produit(s). Les supprimer
              n&rsquo;est pas nécessaire : ces produits perdront simplement cette étiquette.
            </p>
          )}

          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              Ceci supprimera définitivement l&rsquo;étiquette.
            </p>
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
