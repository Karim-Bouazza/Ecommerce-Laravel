import { useQuery } from "@tanstack/react-query"

import { getLogo } from "@/features/site-settings/api/logo-api"

export function useLogo() {
  return useQuery({
    queryKey: ["site-settings", "logo"],
    queryFn: getLogo,
  })
}
