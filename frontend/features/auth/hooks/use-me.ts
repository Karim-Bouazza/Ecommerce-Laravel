"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/features/auth/api/auth-api"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
  })
}
