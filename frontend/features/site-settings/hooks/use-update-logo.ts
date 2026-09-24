"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateLogo } from "@/features/site-settings/api/logo-api"
import { getErrorMessage } from "@/lib/api"

export function useUpdateLogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateLogo,
    onSuccess: (updatedLogo) => {
      toast.success("Logo du site mis à jour.")
      queryClient.setQueryData(["site-settings", "logo"], updatedLogo)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
