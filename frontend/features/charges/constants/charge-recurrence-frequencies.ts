export const CHARGE_RECURRENCE_FREQUENCY_VALUES = ["daily", "weekly", "monthly"] as const

export type ChargeRecurrenceFrequencyValue = (typeof CHARGE_RECURRENCE_FREQUENCY_VALUES)[number]

export const CHARGE_RECURRENCE_FREQUENCIES: { value: ChargeRecurrenceFrequencyValue; label: string }[] = [
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
]
