"use client"

import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TypeToConfirmDialog } from "@/components/shared/type-to-confirm-dialog"
import { useConfirmReturnEntry } from "@/features/return-entries/hooks/use-confirm-return-entry"
import type { ReturnEntry } from "@/features/return-entries/types"

type ConfirmReturnEntryDialogProps = {
  entry: ReturnEntry
}

export function ConfirmReturnEntryDialog({ entry }: ConfirmReturnEntryDialogProps) {
  const { mutate, isPending } = useConfirmReturnEntry(entry.id)

  return (
    <TypeToConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="icon"
          aria-label="Confirmer"
          className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="size-4" />
        </Button>
      }
      title="Confirmer l'entrée"
      description="Ceci validera le retour et mettra à jour votre stock de façon permanente."
      confirmText={entry.reference}
      pendingLabel="Confirmation…"
      isLoading={isPending}
      onConfirm={() => mutate()}
    />
  )
}
