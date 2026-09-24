export const CHARGE_ORDER_TRIGGER_VALUES = ["new_order", "confirmed_order", "delivered_order"] as const

export type ChargeOrderTriggerValue = (typeof CHARGE_ORDER_TRIGGER_VALUES)[number]

export const CHARGE_ORDER_TRIGGERS: { value: ChargeOrderTriggerValue; label: string }[] = [
  { value: "new_order", label: "Chaque nouvelle commande" },
  { value: "confirmed_order", label: "Chaque commande confirmée" },
  { value: "delivered_order", label: "Chaque commande livrée" },
]
