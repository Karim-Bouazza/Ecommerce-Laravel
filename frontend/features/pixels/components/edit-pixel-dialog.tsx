"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PixelFormFields } from "@/features/pixels/components/pixel-form-fields"
import { useUpdatePixel } from "@/features/pixels/hooks/use-update-pixel"
import type { Pixel } from "@/features/pixels/types"

type EditPixelDialogProps = {
  pixel: Pixel
}

export function EditPixelDialog({ pixel }: EditPixelDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdatePixel(pixel, () => setOpen(false))
  const { reset } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) {
          reset({
            name: pixel.name,
            provider: pixel.provider,
            pixel_id: pixel.pixel_id,
            is_active: pixel.is_active,
          })
        }
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Modifier le pixel</DialogTitle>
          </DialogHeader>

          <PixelFormFields form={form} idPrefix="edit-pixel" />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
