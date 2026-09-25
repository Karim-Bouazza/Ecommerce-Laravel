"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createTag } from "@/features/tags/api/tag-api"
import { tagSchema, type TagSchema } from "@/features/tags/schemas/tag-schema"
import { getErrorMessage } from "@/lib/api"

export function useCreateTag(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  })

  const mutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success("Étiquette créée.")
      queryClient.invalidateQueries({ queryKey: ["tags"] })
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
