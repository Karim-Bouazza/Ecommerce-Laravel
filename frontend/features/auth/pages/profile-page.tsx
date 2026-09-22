"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ProfileForm } from "@/features/auth/components/profile-form"
import { useMe } from "@/features/auth/hooks/use-me"

export function ProfilePage() {
  const { data: me, isLoading } = useMe()

  if (isLoading || !me) {
    return (
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return <ProfileForm user={me} />
}
