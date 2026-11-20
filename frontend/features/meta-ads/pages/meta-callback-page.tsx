"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCompleteMetaCallback } from "@/features/meta-ads/hooks/use-meta-ads"
import { getErrorMessage } from "@/lib/api"

/** Landing page of the Meta OAuth redirect: exchanges `code` for a token. */
export function MetaCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const complete = useCompleteMetaCallback()
  const started = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = params.get("code")
    const state = params.get("state")

    if (!code || !state) {
      setError(params.get("error_description") ?? "Connexion Meta annulée.")
      return
    }

    complete.mutate(
      { code, state },
      {
        onSuccess: () => {
          toast.success("Compte Meta connecté.")
          router.replace("/admin/adpilot/publicite")
        },
        onError: (e) => setError(getErrorMessage(e)),
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => router.replace("/admin/adpilot/publicite")}>Retour</Button>
      </div>
    )
  }

  return <p className="text-muted-foreground">Connexion à Meta en cours…</p>
}
