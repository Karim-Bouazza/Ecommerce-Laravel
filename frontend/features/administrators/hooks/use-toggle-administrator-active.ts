"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { toggleAdministratorActive } from "@/features/administrators/api/administrator-api"
import { getErrorMessage } from "@/lib/api"

export function useToggleAdministratorActive(administratorId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleAdministratorActive(administratorId),
    onSuccess: (administrator) => {
      toast.success(administrator.is_active ? "Administrateur activé." : "Administrateur désactivé.")
      queryClient.invalidateQueries({ queryKey: ["administrators"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
