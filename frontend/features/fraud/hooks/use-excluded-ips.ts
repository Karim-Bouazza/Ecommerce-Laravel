"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createExcludedIp, deleteExcludedIp, getExcludedIps } from "@/features/fraud/api/excluded-ip-api"
import { getErrorMessage } from "@/lib/api"

const QUERY_KEY = ["pixel-excluded-ips"]

export function useExcludedIps() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getExcludedIps })
}

export function useCreateExcludedIp(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExcludedIp,
    onSuccess: () => {
      toast.success("Adresse ajoutée à la liste.")
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      onSuccess?.()
    },
  })
}

export function useDeleteExcludedIp(id: number, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteExcludedIp(id),
    onSuccess: () => {
      toast.success("Adresse retirée de la liste.")
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      onSuccess?.()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
