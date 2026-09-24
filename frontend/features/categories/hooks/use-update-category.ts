"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateCategory } from "@/features/categories/api/category-api"
import { categorySchema, type CategorySchema } from "@/features/categories/schemas/category-schema"
import type { Category } from "@/features/categories/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateCategory(category: Category, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      is_active: category.is_active,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: CategorySchema) => updateCategory(category.id, values),
    onSuccess: () => {
      toast.success("Catégorie modifiée.")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  }
}
