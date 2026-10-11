"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateAdministrator } from "@/features/administrators/api/administrator-api"
import {
  updateAdministratorSchema,
  type AdministratorFormValues,
} from "@/features/administrators/schemas/administrator-schema"
import type { Administrator } from "@/features/administrators/types"
import { ApiError, getErrorMessage } from "@/lib/api"

export function administratorToFormValues(administrator: Administrator): AdministratorFormValues {
  return {
    name: administrator.name,
    email: administrator.email,
    phone: administrator.phone ?? "",
    role_id: administrator.role?.id ?? 0,
    is_active: administrator.is_active,
    password: "",
    password_confirmation: "",
  }
}

export function useUpdateAdministrator(administrator: Administrator, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(updateAdministratorSchema) as never,
    defaultValues: administratorToFormValues(administrator),
  })

  const mutation = useMutation({
    mutationFn: (values: AdministratorFormValues) =>
      updateAdministrator(administrator.id, {
        ...values,
        phone: values.phone || undefined,
        password: values.password || undefined,
        password_confirmation: values.password ? values.password_confirmation : undefined,
      }),
    onSuccess: () => {
      toast.success("Administrateur modifié.")
      queryClient.invalidateQueries({ queryKey: ["administrators"] })
      onSuccess?.()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.errors) {
        for (const [field, messages] of Object.entries(error.errors)) {
          form.setError(field as keyof AdministratorFormValues, { message: messages[0] })
        }
        return
      }
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values))

  return { form, onSubmit, isSubmitting: mutation.isPending }
}
