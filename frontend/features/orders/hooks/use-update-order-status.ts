"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateOrderStatus } from "@/features/orders/api/order-api"
import { getErrorMessage } from "@/lib/api"

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      date_report,
    }: {
      id: number
      status: string
      date_report?: string
    }) => updateOrderStatus(id, status, date_report),
    onSuccess: () => {
      toast.success("Statut mis à jour.")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
