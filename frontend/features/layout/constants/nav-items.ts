import {
  Archive,
  Boxes,
  Bot,
  ClipboardList,
  Gauge,
  Landmark,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  Network,
  Package,
  Radio,
  ScanBarcode,
  Settings,
  Share2,
  Smartphone,
  Store,
  Truck,
  User,
  Users,
  Wallet,
} from "lucide-react"

import type { NavSection } from "@/features/layout/types"

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, permission: "tableau_de_bord.view" },
      { label: "Performance (KPI)", href: "/admin/performance", icon: Gauge },
    ],
  },
  {
    label: "Ventes",
    items: [
      { label: "Canaux de vente", href: "/admin/sales-channels", icon: Share2 },
      { label: "Point de vente", href: "/admin/point-of-sale", icon: Store },
      {
        label: "Commandes",
        href: "/admin/orders",
        icon: ClipboardList,
        items: [
          { label: "Nouvelles", href: "/admin/orders/nouvelles", permission: "orders_nouvelles.view" },
          { label: "En Cours", href: "/admin/orders/en-cours", permission: "orders_en_cours.view" },
          { label: "Confirmées", href: "/admin/orders/confirmees", permission: "orders_confirmees.view" },
          { label: "Suivi", href: "/admin/orders/suivi" },
          { label: "Terminées", href: "/admin/orders/terminees", permission: "orders_terminees.view" },
          { label: "Annulée", href: "/admin/orders/annulees", permission: "orders_annulees.view" },
          { label: "Tous", href: "/admin/orders", permission: "orders.view" },
        ],
      },
      {
        label: "Clients",
        href: "/admin/clients",
        icon: Users,
        items: [
          { label: "Clients", href: "/admin/clients" },
          { label: "Liste Noire", href: "/admin/clients/blacklist" },
        ],
      },
    ],
  },
  {
    label: "Catalogue",
    items: [{ label: "Produits", href: "/admin/products", icon: Package, permission: "products.view" }],
  },
  {
    label: "Stock",
    items: [
      {
        label: "Inventaire",
        href: "/admin/inventory",
        icon: Boxes,
        items: [
          { label: "Entrepôts", href: "/admin/inventory/warehouses" },
          { label: "Transferts", href: "/admin/inventory/transfers", permission: "transferts.view" },
          { label: "Stock", href: "/admin/inventory/stock" },
          { label: "Suivi de Stock", href: "/admin/inventory/stock-tracking" },
          { label: "Alerte de Stock", href: "/admin/inventory/stock-alerts" },
          { label: "Fournisseurs", href: "/admin/inventory/suppliers" },
          { label: "Entrées d'achat", href: "/admin/inventory/purchase-entries" },
          {
            label: "Entrées de retour",
            href: "/admin/inventory/return-entries",
            permission: "entrees_retour.view",
          },
          { label: "StockPilot", href: "/admin/inventory/stockpilot" },
        ],
      },
      { label: "Scanner", href: "/admin/scanner", icon: ScanBarcode },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Finances",
        href: "/admin/finances",
        icon: Wallet,
        items: [
          { label: "Portefeuilles", href: "/admin/finances/wallets" },
          { label: "Versements", href: "/admin/finances/payouts" },
          { label: "Paiements", href: "/admin/finances/payments" },
        ],
      },
      { label: "Charges", href: "/admin/charges", icon: Landmark },
    ],
  },
  {
    label: "Croissance",
    items: [
      {
        label: "Analyses",
        href: "/admin/analytics",
        icon: LineChart,
        items: [
          { label: "Commandes", href: "/admin/analytics/orders" },
          { label: "Canaux de vente", href: "/admin/analytics/sales-channels" },
          { label: "Produits", href: "/admin/analytics/products" },
          { label: "Livraison", href: "/admin/analytics/delivery" },
          { label: "Wilayas", href: "/admin/analytics/wilayas" },
          { label: "Agents de Confirmation", href: "/admin/analytics/confirmation-agents" },
          { label: "Agents de Suivi", href: "/admin/analytics/tracking-agents" },
          { label: "Marketer", href: "/admin/analytics/marketer" },
        ],
      },
      {
        label: "Sendpilot",
        href: "/admin/sendpilot",
        icon: Radio,
        items: [
          { label: "Features", href: "/admin/sendpilot/features" },
          { label: "Canaux de messagerie", href: "/admin/sendpilot/messaging-channels" },
          { label: "Campagnes", href: "/admin/sendpilot/campaigns" },
          { label: "Automatisation", href: "/admin/sendpilot/automation" },
          { label: "Modèles", href: "/admin/sendpilot/templates" },
        ],
      },
      {
        label: "Adpilot",
        href: "/admin/adpilot",
        icon: Network,
        items: [
          { label: "New", href: "/admin/adpilot/new" },
          { label: "Comptes", href: "/admin/adpilot/accounts" },
          { label: "Analyses intelligentes", href: "/admin/adpilot/smart-analytics" },
          { label: "Rentabilité", href: "/admin/adpilot/profitability" },
          { label: "Lab de performance", href: "/admin/adpilot/performance-lab" },
        ],
      },
      {
        label: "AI",
        href: "/admin/ai",
        icon: Bot,
        items: [
          { label: "New", href: "/admin/ai/new" },
          { label: "Integration", href: "/admin/ai/integration" },
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Utilisateurs",
        href: "/admin/users",
        icon: User,
        items: [
          { label: "Rôles", href: "/admin/users/roles" },
          { label: "Administrateurs", href: "/admin/users/administrators" },
          { label: "Agents", href: "/admin/users/agents" },
          { label: "Marketers", href: "/admin/users/marketers" },
        ],
      },
      {
        label: "Partenaire",
        href: "/admin/partners",
        icon: Truck,
        items: [
          { label: "Intégration API", href: "/admin/partners/api-integration" },
          { label: "Société", href: "/admin/partners/company" },
          { label: "Livreur", href: "/admin/partners/delivery-person" },
        ],
      },
      {
        label: "Gestion",
        href: "/admin/management",
        icon: Settings,
        items: [
          { label: "Marques", href: "/admin/management/brands" },
          { label: "Statuts", href: "/admin/management/statuses" },
          { label: "Frais de livraison des produits", href: "/admin/management/shipping-fees" },
          { label: "Préférences", href: "/admin/management/preferences" },
          { label: "Notifications", href: "/admin/management/notifications" },
        ],
      },
    ],
  },
  {
    label: "Autres",
    items: [
      { label: "Archiver", href: "/admin/archive", icon: Archive },
      { label: "Discussion", href: "/admin/discussion", icon: MessageCircle },
      { label: "App mobile", href: "/admin/mobile-app", icon: Smartphone },
    ],
  },
]
