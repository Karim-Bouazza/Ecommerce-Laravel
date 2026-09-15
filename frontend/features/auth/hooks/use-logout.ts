"use client"

import { useMutation } from "@tanstack/react-query"

import { logout } from "@/features/auth/api/auth-api"

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  })
}
