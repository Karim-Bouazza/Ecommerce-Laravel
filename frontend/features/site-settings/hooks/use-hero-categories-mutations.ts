"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  createHeroCategory,
  deleteHeroCategory,
  updateHeroCategory,
} from "@/features/site-settings/api/hero-categories-api"
import { getErrorMessage } from "@/lib/api"

const QUERY_KEY = ["site-settings", "hero-categories"]

export function useCreateHeroCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHeroCategory,
    onSuccess: () => {
      toast.success("Catégorie ajoutée à la mise en avant.")
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateHeroCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number
      category_id?: number
      image?: Blob
      position?: number
    }) => updateHeroCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteHeroCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHeroCategory,
    onSuccess: () => {
      toast.success("Catégorie retirée de la mise en avant.")
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
