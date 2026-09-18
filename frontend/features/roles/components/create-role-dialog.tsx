"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateRole } from "@/features/roles/hooks/use-create-role"
import { usePermissionsCatalogue } from "@/features/roles/hooks/use-permissions-catalogue"
import { RoleFormFields } from "@/features/roles/components/role-form-fields"

export function CreateRoleDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateRole(() => setOpen(false))
  const { data: permissionGroups = [], isPending: isLoadingPermissions } = usePermissionsCatalogue(open)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Nouveau Rôle
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-5xl">
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Nouveau rôle</DialogTitle>
          </DialogHeader>

          <RoleFormFields
            form={form}
            permissionGroups={permissionGroups}
            isLoadingPermissions={isLoadingPermissions}
            idPrefix="create-role"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
