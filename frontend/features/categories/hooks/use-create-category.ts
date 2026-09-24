"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createCategory } from "@/features/categories/api/category-api"
import { categorySchema, type CategorySchema } from "@/features/categories/schemas/category-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateCategory(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      is_active: true,
    },
  })

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Catégorie créée.")
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      form.reset()
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
