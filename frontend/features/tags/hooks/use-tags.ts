"use client"

import { useQuery } from "@tanstack/react-query"

import { getTagOptions } from "@/features/tags/api/tag-api"

export function useTags() {
  return useQuery({
    queryKey: ["tags", "options"],
    queryFn: getTagOptions,
    staleTime: Infinity,
  })
}
