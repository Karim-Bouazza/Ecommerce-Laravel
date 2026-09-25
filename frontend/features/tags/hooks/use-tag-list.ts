"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { getTags, type GetTagsParams } from "@/features/tags/api/tag-api"

export function useTagList(params: GetTagsParams) {
  return useQuery({
    queryKey: ["tags", "list", params],
    queryFn: () => getTags(params),
    placeholderData: keepPreviousData,
  })
}
