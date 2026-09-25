"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createBrand } from "@/features/brands/api/brand-api"
import { brandSchema, type BrandSchema } from "@/features/brands/schemas/brand-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateBrand(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      is_active: true,
    },
  })

  const mutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      toast.success("Marque créée.")
      queryClient.invalidateQueries({ queryKey: ["brands"] })
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
