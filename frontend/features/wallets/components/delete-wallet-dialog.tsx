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
import { useDeleteWallet } from "@/features/wallets/hooks/use-delete-wallet"
import type { Wallet } from "@/features/wallets/types"

type DeleteWalletDialogProps = {
  wallet: Wallet
}

export function DeleteWalletDialog({ wallet }: DeleteWalletDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useDeleteWallet(wallet.id, () => setOpen(false))
  const hasActivity = wallet.entries_sum_amount > 0 || wallet.exits_sum_amount > 0

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
          <DialogTitle>Confirmer l&rsquo;opération</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          {hasActivity && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              Ce portefeuille contient des paiements et des transactions. Le supprimer entraînera
              la suppression définitive du portefeuille ainsi que toutes ses transactions et
              paiements.
            </p>
          )}

          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
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
