"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateOrderStatus } from "@/features/orders/api/order-api"
import { getErrorMessage } from "@/lib/api"

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Statut mis à jour.")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
