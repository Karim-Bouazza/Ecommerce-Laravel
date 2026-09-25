"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { togglePixelActive } from "@/features/pixels/api/pixel-api"
import { getErrorMessage } from "@/lib/api"

export function useTogglePixelActive(pixelId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => togglePixelActive(pixelId),
    onSuccess: (pixel) => {
      toast.success(pixel.is_active ? "Pixel activé." : "Pixel désactivé.")
      queryClient.invalidateQueries({ queryKey: ["pixels"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
