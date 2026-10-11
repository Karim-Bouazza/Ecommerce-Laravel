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
import { AdministratorFormFields } from "@/features/administrators/components/administrator-form-fields"
import { useAdministratorRoleOptions } from "@/features/administrators/hooks/use-administrator-role-options"
import {
  emptyAdministratorValues,
  useCreateAdministrator,
} from "@/features/administrators/hooks/use-create-administrator"

export function CreateAdministratorDialog() {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useCreateAdministrator(() => setOpen(false))
  const { data: roles = [], isPending: isLoadingRoles } = useAdministratorRoleOptions(open)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset(emptyAdministratorValues)
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Nouvel Admin
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Nouvel administrateur</DialogTitle>
          </DialogHeader>

          <AdministratorFormFields
            form={form}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
            idPrefix="create-administrator"
            passwordRequired
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
