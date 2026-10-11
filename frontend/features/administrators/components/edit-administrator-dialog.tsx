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
import { AdministratorFormFields } from "@/features/administrators/components/administrator-form-fields"
import { useAdministratorRoleOptions } from "@/features/administrators/hooks/use-administrator-role-options"
import {
  administratorToFormValues,
  useUpdateAdministrator,
} from "@/features/administrators/hooks/use-update-administrator"
import type { Administrator } from "@/features/administrators/types"

type EditAdministratorDialogProps = {
  administrator: Administrator
}

export function EditAdministratorDialog({ administrator }: EditAdministratorDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { form, onSubmit, isSubmitting } = useUpdateAdministrator(administrator, () => setOpen(false))
  const { data: roles = [], isPending: isLoadingRoles } = useAdministratorRoleOptions(open)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        // Always reopen on the latest saved values, discarding unsaved edits.
        form.reset(administratorToFormValues(administrator))
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon" aria-label="Modifier" />}>
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;administrateur</DialogTitle>
          </DialogHeader>

          <AdministratorFormFields
            form={form}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
            idPrefix={`edit-administrator-${administrator.id}`}
            passwordRequired={false}
            isSelf={administrator.is_current}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Fermer
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingRoles}>
              {isSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
