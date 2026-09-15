"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { toggleWarehouseActive } from "@/features/warehouses/api/warehouse-api"
import { getErrorMessage } from "@/lib/api"

export function useToggleWarehouseActive(warehouseId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleWarehouseActive(warehouseId),
    onSuccess: (warehouse) => {
      toast.success(warehouse.active ? "Entrepôt activé." : "Entrepôt désactivé.")
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
