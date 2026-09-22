"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { updateProfile } from "@/features/auth/api/auth-api"
import {
  profileSchema,
  type ProfileFormInput,
  type ProfileFormOutput,
} from "@/features/auth/schemas/profile-schema"
import type { User } from "@/features/auth/types"
import { getErrorMessage } from "@/lib/api"

function toDefaultValues(user: User): ProfileFormInput {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    avatar: null,
    current_password: "",
    password: "",
    password_confirmation: "",
  }
}

export function useUpdateProfile(user: User) {
  const queryClient = useQueryClient()

  const form = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: toDefaultValues(user),
  })

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success("Profil mis à jour.")
      queryClient.setQueryData(["me"], updatedUser)
      form.reset(toDefaultValues(updatedUser))
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
