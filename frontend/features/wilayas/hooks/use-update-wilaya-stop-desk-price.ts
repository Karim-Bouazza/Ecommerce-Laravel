"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateWilayaStopDeskPrice } from "@/features/wilayas/api/wilaya-api"
import { getErrorMessage } from "@/lib/api"

export function useUpdateWilayaStopDeskPrice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, price_stop_desk }: { id: number; price_stop_desk: number }) =>
      updateWilayaStopDeskPrice(id, price_stop_desk),
    onSuccess: () => {
      toast.success("Prix Stop Desk mis à jour.")
      queryClient.invalidateQueries({ queryKey: ["wilayas"] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
