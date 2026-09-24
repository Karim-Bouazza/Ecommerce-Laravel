"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateColorsTheme } from "@/features/site-settings/api/colors-theme-api"
import { colorsThemeSchema, type ColorsThemeSchema } from "@/features/site-settings/schemas/colors-theme-schema"
import type { SiteColorsTheme } from "@/features/site-settings/types"
import { getErrorMessage } from "@/lib/api"

export function useUpdateColorsTheme(theme: SiteColorsTheme) {
  const queryClient = useQueryClient()

  const form = useForm<ColorsThemeSchema>({
    resolver: zodResolver(colorsThemeSchema),
    defaultValues: theme,
  })

  const mutation = useMutation({
    mutationFn: updateColorsTheme,
    onSuccess: (updatedTheme) => {
      toast.success("Couleurs du site mises à jour.")
      queryClient.setQueryData(["site-settings", "colors-theme"], updatedTheme)
      form.reset(updatedTheme)
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
