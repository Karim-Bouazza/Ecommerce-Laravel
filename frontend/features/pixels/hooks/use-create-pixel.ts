"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createPixel } from "@/features/pixels/api/pixel-api"
import { pixelSchema, type PixelSchema } from "@/features/pixels/schemas/pixel-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreatePixel(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<PixelSchema>({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      name: "",
      provider: "facebook",
      pixel_id: "",
      is_active: true,
    },
  })

  const mutation = useMutation({
    mutationFn: createPixel,
    onSuccess: () => {
      toast.success("Pixel créé.")
      queryClient.invalidateQueries({ queryKey: ["pixels"] })
      form.reset()
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
