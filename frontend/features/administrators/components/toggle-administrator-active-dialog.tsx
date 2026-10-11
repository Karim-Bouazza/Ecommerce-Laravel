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
import { useToggleAdministratorActive } from "@/features/administrators/hooks/use-toggle-administrator-active"
import type { Administrator } from "@/features/administrators/types"

type ToggleAdministratorActiveDialogProps = {
  administrator: Administrator
}

export function ToggleAdministratorActiveDialog({ administrator }: ToggleAdministratorActiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useToggleAdministratorActive(administrator.id, () => setOpen(false))

  if (administrator.is_current) {
    return null
  }

  const deactivating = administrator.is_active

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={deactivating ? "Désactiver" : "Activer"}
            className={
              deactivating
                ? "text-amber-600 hover:text-amber-600 dark:text-amber-400"
                : "text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
            }
          />
        }
      >
        {deactivating ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deactivating ? "Désactiver le compte" : "Activer le compte"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              {deactivating
                ? `${administrator.name} sera déconnecté et ne pourra plus se connecter.`
                : `${administrator.name} pourra de nouveau se connecter.`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button type="button" disabled={isPending} onClick={() => mutate()}>
            {isPending ? "Traitement…" : "Oui"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
