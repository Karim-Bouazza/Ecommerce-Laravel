"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getPixels, type GetPixelsParams } from "@/features/pixels/api/pixel-api"

export function usePixelList(params: GetPixelsParams) {
  return useQuery({
    queryKey: ["pixels", "list", params],
    queryFn: () => getPixels(params),
    placeholderData: keepPreviousData,
  })
}
