import {
  Boxes,
  ClipboardList,
  Gauge,
  Landmark,
  LayoutDashboard,
  LineChart,
  Network,
  Package,
  Palette,
  ShieldAlert,
  Tag,
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
    label: "Fraude",
    items: [
      {
        label: "Détection de fraude",
        href: "/admin/fraud",
        icon: ShieldAlert,
        items: [
          { label: "Évaluations", href: "/admin/fraud", permission: "fraud.view" },
          { label: "IP exclues du pixel", href: "/admin/fraud/excluded-ips", permission: "pixels.view" },
        ],
      },
    ],
  },
  {
    label: "Ventes",
    items: [
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
    items: [
      { label: "Produits", href: "/admin/products", icon: Package, permission: "products.view" },
      { label: "Catégories", href: "/admin/categories", icon: Tag, permission: "categories.view" },
    ],
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
          { label: "Commandes", href: "/admin/analytics/orders", permission: "analytics_orders.view" },
          {
            label: "Canaux de vente",
            href: "/admin/analytics/sales-channels",
            permission: "analytics_sales_channels.view",
          },
          { label: "Produits", href: "/admin/analytics/products" },
          { label: "Livraison", href: "/admin/analytics/delivery" },
          { label: "Wilayas", href: "/admin/analytics/wilayas" },
        ],
      },
      {
        label: "Adpilot",
        href: "/admin/adpilot",
        icon: Network,
        items: [
          { label: "Pixels", href: "/admin/adpilot/pixels", permission: "pixels.view" },
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
        ],
      },
      {
        label: "Partenaire",
        href: "/admin/partners",
        icon: Truck,
        items: [
          { label: "Intégration API", href: "/admin/partners/api-integration" },
          { label: "Stop Desk", href: "/admin/partners/stop-desk" },
        ],
      },
      {
        label: "Site Web",
        href: "/admin/website",
        icon: Palette,
        items: [
          { label: "Langue", href: "/admin/website/language" },
          { label: "Catégories (Accueil)", href: "/admin/website/hero-categories" },
          { label: "Meilleures offres", href: "/admin/website/best-offers" },
          { label: "Nos atouts", href: "/admin/website/features" },
          { label: "Nouveautés", href: "/admin/website/new-arrivals" },
          { label: "Votre style", href: "/admin/website/style-picks" },
          { label: "Bannières promo", href: "/admin/website/promo-banners" },
        ],
      },
    ],
  },
]
