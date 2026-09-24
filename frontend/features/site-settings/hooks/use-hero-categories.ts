import { useQuery } from "@tanstack/react-query"

import { getHeroCategories } from "@/features/site-settings/api/hero-categories-api"

export function useHeroCategories() {
  return useQuery({
    queryKey: ["site-settings", "hero-categories"],
    queryFn: getHeroCategories,
  })
}
