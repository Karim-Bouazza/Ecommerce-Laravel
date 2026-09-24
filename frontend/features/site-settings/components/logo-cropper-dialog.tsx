"use client"

import { useCallback, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

const ASPECT_RATIO = 3

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.crossOrigin = "anonymous"
    image.src = src
  })
}

// react-easy-crop only reports the selected crop rectangle (in image pixels);
// it does not render the final file, so we draw that rectangle onto a canvas
// ourselves to produce the PNG blob that gets uploaded.
async function cropToBlob(imageSrc: string, area: Area, width = 900, height = 300): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Impossible de créer le contexte du canevas.")
  }

  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error("Impossible de générer l'image recadrée."))
    }, "image/png")
  })
}

export function LogoCropperDialog({
  imageSrc,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: {
  imageSrc: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (blob: Blob) => void
  isSubmitting: boolean
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels)
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedArea(null)
    }
    onOpenChange(nextOpen)
  }

  async function handleConfirm() {
    if (!imageSrc || !croppedArea) return
    const blob = await cropToBlob(imageSrc, croppedArea)
    onConfirm(blob)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Recadrer le logo</DialogTitle>
          <DialogDescription>
            Ajustez le cadrage et le zoom, puis enregistrez pour mettre à jour le logo affiché sur
            la boutique.
          </DialogDescription>
        </DialogHeader>

        {imageSrc && (
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={ASPECT_RATIO}
              objectFit="contain"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <Slider value={zoom} min={1} max={3} step={0.05} onValueChange={(value) => setZoom(value as number)} />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!croppedArea || isSubmitting}>
            {isSubmitting ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
