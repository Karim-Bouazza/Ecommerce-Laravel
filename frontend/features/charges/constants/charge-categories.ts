import {
  Banknote,
  LayoutGrid,
  Laptop,
  Megaphone,
  Package,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react"

export interface ChargeCategoryDefinition {
  key: string
  label: string
  icon: LucideIcon
}

export const CHARGE_CATEGORIES: ChargeCategoryDefinition[] = [
  { key: "marketing", label: "Charges marketing", icon: Megaphone },
  { key: "human_resources", label: "Charges ressources humaines", icon: Users },
  { key: "it", label: "Charges IT", icon: Laptop },
  { key: "packaging", label: "Charges emballage", icon: Package },
  { key: "cod", label: "Charges COD", icon: Banknote },
  { key: "warehouse", label: "Charges entrepôt", icon: Warehouse },
  { key: "other", label: "Charges diverses", icon: LayoutGrid },
]
