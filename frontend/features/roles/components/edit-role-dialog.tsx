"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RoleFormFields } from "@/features/roles/components/role-form-fields"
import { useRoleDetail } from "@/features/roles/hooks/use-role-detail"
import { usePermissionsCatalogue } from "@/features/roles/hooks/use-permissions-catalogue"
import { useUpdateRole } from "@/features/roles/hooks/use-update-role"
import type { Role } from "@/features/roles/types"

type EditRoleDialogProps = {
  role: Role
}

export function EditRoleDialog({ role }: EditRoleDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { data: roleDetail, isPending: isLoadingRole } = useRoleDetail(open ? role.id : null)
  const { data: permissionGroups = [], isPending: isLoadingPermissions } = usePermissionsCatalogue(open)
  const { form, onSubmit, isSubmitting } = useUpdateRole(role.id, () => setOpen(false))
  const { reset } = form

  React.useEffect(() => {
    if (!roleDetail) return

    const granted = roleDetail.permission_groups.flatMap((group) =>
      group.permissions.filter((permission) => permission.granted).map((permission) => permission.key)
    )

    reset({ name: roleDetail.name, permissions: granted })
  }, [roleDetail, reset])

  if (role.is_system) {
    return null
  }

  const isLoading = isLoadingRole || isLoadingPermissions

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) reset({ name: "", permissions: [] })
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-5xl">
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
          </DialogHeader>

          <RoleFormFields
            form={form}
            permissionGroups={permissionGroups}
            isLoadingPermissions={isLoading}
            idPrefix="edit-role"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
