"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getVersements, type GetVersementsParams } from "@/features/versements/api/versement-api"

export function useVersements(params: GetVersementsParams) {
  return useQuery({
    queryKey: ["versements", params],
    queryFn: () => getVersements(params),
    placeholderData: keepPreviousData,
  })
}
