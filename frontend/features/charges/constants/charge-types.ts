export const CHARGE_TYPE_VALUES = ["normal", "per_order", "recurring"] as const

export type ChargeTypeValue = (typeof CHARGE_TYPE_VALUES)[number]

export const CHARGE_TYPES: { value: ChargeTypeValue; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "per_order", label: "Par commande" },
  { value: "recurring", label: "Récurrent" },
]
