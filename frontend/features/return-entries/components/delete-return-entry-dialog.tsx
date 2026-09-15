"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TypeToConfirmDialog } from "@/components/shared/type-to-confirm-dialog"
import { useDeleteReturnEntry } from "@/features/return-entries/hooks/use-delete-return-entry"
import type { ReturnEntry } from "@/features/return-entries/types"

type DeleteReturnEntryDialogProps = {
  entry: ReturnEntry
}

export function DeleteReturnEntryDialog({ entry }: DeleteReturnEntryDialogProps) {
  const { mutate, isPending } = useDeleteReturnEntry(entry.id)

  return (
    <TypeToConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label="Supprimer"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
      title="Supprimer l'entrée"
      description="Vous voulez supprimer cette entrée"
      confirmText={entry.reference}
      confirmLabel="Oui, supprimer"
      pendingLabel="Suppression…"
      variant="destructive"
      isLoading={isPending}
      onConfirm={() => mutate()}
    />
  )
}
