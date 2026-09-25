"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createProduct } from "@/features/products/api/product-api"
import {
  productSchema,
  type ProductFormInput,
  type ProductFormOutput,
} from "@/features/products/schemas/product-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateProduct(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: null,
      description: "",
      short_description: null,
      category_id: null,
      brand_id: null,
      purchase_price: null,
      price: 0,
      is_active: true,
      is_new: false,
      tags: [],
      specs: [],
      variants: [],
      image: null,
    },
  })

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Produit créé.")
      queryClient.invalidateQueries({ queryKey: ["products"] })
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
