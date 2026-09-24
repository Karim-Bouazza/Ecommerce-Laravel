import { useQuery } from "@tanstack/react-query"

import { getColorsTheme } from "@/features/site-settings/api/colors-theme-api"

export function useColorsTheme() {
  return useQuery({
    queryKey: ["site-settings", "colors-theme"],
    queryFn: getColorsTheme,
  })
}
