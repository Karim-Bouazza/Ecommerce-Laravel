"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { createAdministrator } from "@/features/administrators/api/administrator-api"
import {
  createAdministratorSchema,
  type AdministratorFormValues,
} from "@/features/administrators/schemas/administrator-schema"
import { ApiError, getErrorMessage } from "@/lib/api"

export const emptyAdministratorValues: AdministratorFormValues = {
  name: "",
  email: "",
  phone: "",
  role_id: 0,
  is_active: true,
  password: "",
  password_confirmation: "",
}

export function useCreateAdministrator(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(createAdministratorSchema) as never,
    defaultValues: emptyAdministratorValues,
  })

  const mutation = useMutation({
    mutationFn: createAdministrator,
    onSuccess: () => {
      toast.success("Administrateur créé.")
      queryClient.invalidateQueries({ queryKey: ["administrators"] })
      form.reset(emptyAdministratorValues)
      onSuccess?.()
    },
    onError: (error) => {
      // Surface server-side validation (e.g. duplicate email) next to the field.
      if (error instanceof ApiError && error.errors) {
        for (const [field, messages] of Object.entries(error.errors)) {
          form.setError(field as keyof AdministratorFormValues, { message: messages[0] })
        }
        return
      }
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({ ...values, phone: values.phone || undefined })
  })

  return { form, onSubmit, isSubmitting: mutation.isPending }
}
