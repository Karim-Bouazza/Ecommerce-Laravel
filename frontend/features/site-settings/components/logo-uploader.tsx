"use client"

import { type ChangeEvent, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LogoCropperDialog } from "@/features/site-settings/components/logo-cropper-dialog"
import { useUpdateLogo } from "@/features/site-settings/hooks/use-update-logo"
import type { SiteLogo } from "@/features/site-settings/types"

export function LogoUploader({ logo }: { logo: SiteLogo }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)
  const mutation = useUpdateLogo()

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setPendingImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleConfirmCrop(blob: Blob) {
    mutation.mutate(blob, {
      onSuccess: () => setPendingImageSrc(null),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-4">
        {logo.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.logo_url}
            alt="Logo actuel"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-sm text-muted-foreground">Aucun logo configuré</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
        <ImagePlus />
        Changer le logo
      </Button>

      <LogoCropperDialog
        imageSrc={pendingImageSrc}
        open={!!pendingImageSrc}
        onOpenChange={(open) => !open && setPendingImageSrc(null)}
        onConfirm={handleConfirmCrop}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
