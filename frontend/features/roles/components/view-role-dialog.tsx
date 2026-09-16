"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRoleDetail } from "@/features/roles/hooks/use-role-detail"
import type { Role } from "@/features/roles/types"

type ViewRoleDialogProps = {
  role: Role
}

export function ViewRoleDialog({ role }: ViewRoleDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { data, isPending } = useRoleDetail(open ? role.id : null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Voir les détails"
            className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          />
        }
      >
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Détails du rôle</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="view-role-name">Rôle</Label>
            <Input id="view-role-name" value={role.name} disabled />
          </div>

          <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
            {isPending || !data
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                ))
              : data.permission_groups.map((group) => (
                  <Card key={group.group} size="sm" className="shadow-sm">
                    <CardHeader className="border-b pb-2.5">
                      <CardTitle className="text-sm font-semibold">{group.group}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      {group.permissions.map((permission) => (
                        <Label
                          key={permission.key}
                          className="items-start gap-2.5 text-sm leading-snug font-normal text-muted-foreground has-data-checked:text-foreground"
                        >
                          <Checkbox checked={permission.granted} disabled className="mt-0.5" />
                          {permission.label}
                        </Label>
                      ))}
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
