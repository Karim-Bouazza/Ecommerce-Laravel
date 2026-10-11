"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getAdministrators,
  type GetAdministratorsParams,
} from "@/features/administrators/api/administrator-api"

export function useAdministrators(params: GetAdministratorsParams) {
  return useQuery({
    queryKey: ["administrators", params],
    queryFn: () => getAdministrators(params),
    placeholderData: keepPreviousData,
  })
}
