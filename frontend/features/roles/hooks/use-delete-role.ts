"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteRole } from "@/features/roles/api/role-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteRole(roleId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteRole(roleId),
    onSuccess: () => {
      toast.success("Rôle supprimé.")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
