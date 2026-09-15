"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type TypeToConfirmDialogProps = {
  trigger: React.ReactElement
  title: string
  description: string
  confirmText: string
  confirmLabel?: string
  pendingLabel?: string
  variant?: "default" | "destructive"
  isLoading?: boolean
  onConfirm: () => void
}

export function TypeToConfirmDialog({
  trigger,
  title,
  description,
  confirmText,
  confirmLabel = "Oui",
  pendingLabel = "Confirmation…",
  variant = "default",
  isLoading = false,
  onConfirm,
}: TypeToConfirmDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const isMatch = value === confirmText

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setValue("")
      }}
    >
      <DialogTrigger render={trigger}>
        {(trigger.props as { children?: React.ReactNode }).children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div
            className={
              variant === "destructive"
                ? "flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                : "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
            }
          >
            <TriangleAlert className="size-6" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold">Êtes-vous sûr ?</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex w-full flex-col gap-2 rounded-md border-l-4 border-amber-500 bg-amber-500/10 px-3 py-2 text-left">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Veuillez saisir le texte ci-dessous pour confirmer : <strong>{confirmText}</strong>
            </p>
            <Input value={value} onChange={(event) => setValue(event.target.value)} autoFocus />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Non
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={!isMatch || isLoading}
            onClick={onConfirm}
          >
            {isLoading ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
