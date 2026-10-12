"use client"

import { type ChangeEvent, useEffect, useMemo, useRef } from "react"
import { ImagePlus } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

type ImageInputProps = {
  id: string
  value: File | null
  currentUrl: string | null
  onChange: (file: File | null) => void
  invalid?: boolean
  className?: string
}

/**
 * Image picker with preview: shows the chosen file, otherwise the saved image.
 */
export function ImageInput({ id, value, currentUrl, onChange, invalid, className }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const shown = previewUrl ?? currentUrl

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className={cn(
          "flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted",
          invalid && "border-destructive"
        )}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Aperçu" className="size-full object-cover" />
        ) : (
          <ImagePlus aria-hidden="true" className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-1.5">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          aria-invalid={invalid}
          onChange={handleChange}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          {shown ? "Changer l'image" : "Choisir une image"}
        </Button>
        <p className="text-xs text-muted-foreground">PNG, JPG ou WebP, 4 Mo maximum.</p>
      </div>
    </div>
  )
}
