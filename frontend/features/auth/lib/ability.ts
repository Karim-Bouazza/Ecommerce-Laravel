import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability"

import type { User } from "@/features/auth/types"

export type AppAbility = MongoAbility<[string, string]>

/** Splits a backend permission key ("products.view") into [subject, action] on the first dot. */
export function parsePermissionKey(key: string): [subject: string, action: string] {
  const dotIndex = key.indexOf(".")
  if (dotIndex === -1) return [key, ""]
  return [key.slice(0, dotIndex), key.slice(dotIndex + 1)]
}

export function defineAbilitiesFor(user: User | null | undefined): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (user?.role) {
    if (user.role.is_system) {
      can("manage", "all")
    } else {
      for (const key of user.role.permissions) {
        const [subject, action] = parsePermissionKey(key)
        if (!action) continue
        can(action, subject)
      }
    }
  }

  return build()
}
