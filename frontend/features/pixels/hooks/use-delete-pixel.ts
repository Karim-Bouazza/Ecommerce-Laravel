"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deletePixel } from "@/features/pixels/api/pixel-api"
import { getErrorMessage } from "@/lib/api"

export function useDeletePixel(pixelId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePixel(pixelId),
    onSuccess: () => {
      toast.success("Pixel supprimé.")
      queryClient.invalidateQueries({ queryKey: ["pixels"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
