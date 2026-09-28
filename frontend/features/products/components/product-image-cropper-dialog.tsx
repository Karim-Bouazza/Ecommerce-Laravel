"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const ASPECT_RATIO = 1;
const MIN_ZOOM = 0.5;
const OUTPUT_SIZE = 1200;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

async function cropToFile(
  imageSrc: string,
  area: Area,
  fileName: string,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossible de créer le contexte du canevas.");

  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Impossible de générer l'image recadrée.")),
      "image/jpeg",
      0.9,
    );
  });

  const baseName = fileName.replace(/\.[^.]+$/, "") || "product-image";
  return new File([blob], `${baseName}-cropped.jpg`, { type: "image/jpeg" });
}

export function ProductImageCropperDialog({
  imageSrc,
  fileName,
  open,
  onOpenChange,
  onConfirm,
}: {
  imageSrc: string | null;
  fileName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedArea(null);
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!imageSrc || !fileName || !croppedArea) return;

    setIsProcessing(true);
    setError(null);
    try {
      onConfirm(await cropToFile(imageSrc, croppedArea, fileName));
      handleOpenChange(false);
    } catch {
      setError("Impossible de recadrer cette image. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Recadrer l’image du produit</DialogTitle>
          <DialogDescription>
            Ajustez le cadrage et le zoom avant d’ajouter cette image au
            produit.
          </DialogDescription>
        </DialogHeader>

        {imageSrc && (
          <div className="relative mx-auto aspect-square max-h-[45vh] max-w-[45vh] w-full overflow-hidden rounded-lg bg-muted">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              aspect={ASPECT_RATIO}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <Slider
            value={zoom}
            min={MIN_ZOOM}
            max={3}
            step={0.05}
            onValueChange={(value) => setZoom(value as number)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!croppedArea || isProcessing}
          >
            {isProcessing ? "Traitement…" : "Utiliser cette image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
