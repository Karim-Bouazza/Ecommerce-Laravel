"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { deleteWarehouse } from "@/features/warehouses/api/warehouse-api"
import { getErrorMessage } from "@/lib/api"

export function useDeleteWarehouse(warehouseId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteWarehouse(warehouseId),
    onSuccess: () => {
      toast.success("Entrepôt supprimé.")
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
