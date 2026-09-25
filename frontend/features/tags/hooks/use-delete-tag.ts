"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteTag } from "@/features/tags/api/tag-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteTag(tagId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteTag(tagId),
    onSuccess: () => {
      toast.success("Étiquette supprimée.")
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
