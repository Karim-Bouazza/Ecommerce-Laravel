"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { login } from "@/features/auth/api/auth-api"
import { loginSchema, type LoginSchema } from "@/features/auth/schemas/login-schema"
import { getErrorMessage } from "@/lib/api"

export function useLogin() {
  const router = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      toast.success(`Bienvenue, ${user.name}.`)
      router.push("/admin")
      router.refresh()
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
