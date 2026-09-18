"use client"

import { Controller, type UseFormReturn } from "react-hook-form"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PermissionCatalogueGroup } from "@/features/roles/types"
import type { RoleSchema } from "@/features/roles/schemas/role-schema"

type RoleFormFieldsProps = {
  form: UseFormReturn<RoleSchema>
  permissionGroups: PermissionCatalogueGroup[]
  isLoadingPermissions: boolean
  idPrefix: string
}

export function RoleFormFields({
  form,
  permissionGroups,
  isLoadingPermissions,
  idPrefix,
}: RoleFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form

  const allKeys = permissionGroups.flatMap((group) => group.permissions.map((permission) => permission.key))

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Rôle</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          placeholder="Nom du rôle"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>

      <Controller
        control={control}
        name="permissions"
        render={({ field }) => {
          const selected = new Set(field.value)
          const allSelected = allKeys.length > 0 && allKeys.every((key) => selected.has(key))

          const setSelected = (keys: string[]) => field.onChange(keys)

          const toggleAll = (checked: boolean) => {
            setSelected(checked ? allKeys : [])
          }

          const toggleGroup = (groupKeys: string[], checked: boolean) => {
            const next = new Set(selected)
            groupKeys.forEach((key) => (checked ? next.add(key) : next.delete(key)))
            setSelected(Array.from(next))
          }

          const togglePermission = (key: string, checked: boolean) => {
            const next = new Set(selected)
            if (checked) next.add(key)
            else next.delete(key)
            setSelected(Array.from(next))
          }

          return (
            <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card size="sm" className="shadow-sm">
                <CardHeader className="border-b pb-2.5">
                  <CardTitle className="text-sm font-semibold">Tous</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Label className="items-start gap-2.5 text-sm leading-snug font-normal text-muted-foreground has-data-checked:text-foreground">
                    <Checkbox
                      checked={allSelected}
                      disabled={isLoadingPermissions}
                      onCheckedChange={(checked) => toggleAll(checked === true)}
                      className="mt-0.5"
                    />
                    Tous
                  </Label>
                </CardContent>
              </Card>

              {isLoadingPermissions
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
                  ))
                : permissionGroups.map((group) => {
                    const groupKeys = group.permissions.map((permission) => permission.key)
                    const groupAllSelected = groupKeys.length > 0 && groupKeys.every((key) => selected.has(key))

                    return (
                      <Card key={group.group} size="sm" className="shadow-sm">
                        <CardHeader className="border-b pb-2.5">
                          <Label className="items-start gap-2.5 text-sm font-semibold">
                            <Checkbox
                              checked={groupAllSelected}
                              onCheckedChange={(checked) => toggleGroup(groupKeys, checked === true)}
                              className="mt-0.5"
                            />
                            <CardTitle className="text-sm font-semibold">{group.group}</CardTitle>
                          </Label>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                          {group.permissions.map((permission) => (
                            <Label
                              key={permission.key}
                              className="items-start gap-2.5 text-sm leading-snug font-normal text-muted-foreground has-data-checked:text-foreground"
                            >
                              <Checkbox
                                checked={selected.has(permission.key)}
                                onCheckedChange={(checked) =>
                                  togglePermission(permission.key, checked === true)
                                }
                                className="mt-0.5"
                              />
                              {permission.label}
                            </Label>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  })}
            </div>
          )
        }}
      />
    </div>
  )
}
