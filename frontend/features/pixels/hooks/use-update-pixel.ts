"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updatePixel } from "@/features/pixels/api/pixel-api"
import { pixelSchema, type PixelSchema } from "@/features/pixels/schemas/pixel-schema"
import type { Pixel } from "@/features/pixels/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdatePixel(pixel: Pixel, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PixelSchema>({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      name: pixel.name,
      provider: pixel.provider,
      pixel_id: pixel.pixel_id,
      is_active: pixel.is_active,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: PixelSchema) => updatePixel(pixel.id, values),
    onSuccess: () => {
      toast.success("Pixel modifié.")
      queryClient.invalidateQueries({ queryKey: ["pixels"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
