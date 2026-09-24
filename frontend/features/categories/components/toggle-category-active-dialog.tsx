"use client"

import * as React from "react"
import { HelpCircle, Power, PowerOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToggleCategoryActive } from "@/features/categories/hooks/use-toggle-category-active"
import type { Category } from "@/features/categories/types"

type ToggleCategoryActiveDialogProps = {
  category: Category
}

export function ToggleCategoryActiveDialog({ category }: ToggleCategoryActiveDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { mutate, isPending } = useToggleCategoryActive(category.id, () => setOpen(false))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          category.is_active ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Désactiver"
              className="text-destructive hover:text-destructive"
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Activer"
              className="text-emerald-600 hover:text-emerald-600 dark:text-emerald-400"
            />
          )
        }
      >
        {category.is_active ? <PowerOff className="size-4" /> : <Power className="size-4" />}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la catégorie</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HelpCircle className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">
              Ceci mettra à jour le statut d&rsquo;activation de la catégorie.
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
