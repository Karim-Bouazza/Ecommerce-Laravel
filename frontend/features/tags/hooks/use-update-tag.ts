"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateTag } from "@/features/tags/api/tag-api"
import { tagSchema, type TagSchema } from "@/features/tags/schemas/tag-schema"
import type { Tag } from "@/features/tags/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateTag(tag: Tag, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag.name,
    },
  })

  const mutation = useMutation({
    mutationFn: (values: TagSchema) => updateTag(tag.id, values),
    onSuccess: () => {
      toast.success("Étiquette modifiée.")
      queryClient.invalidateQueries({ queryKey: ["tags"] })
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
