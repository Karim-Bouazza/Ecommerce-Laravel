import type { StorefrontSection } from "@/features/site-settings/types"

export type StorefrontSectionConfig = {
  section: StorefrontSection
  title: string
  description: string
  /** Mirrors StorefrontProductSection::maxItems() on the backend. */
  max: number
  /** Text shown on the role of each position, e.g. "Grande carte" for the first one. */
  slotLabel: (index: number) => string | null
  /** Optional free text stored with each product; null when the section has none. */
  labelField: { name: string; placeholder: string; help: string } | null
}

export const STOREFRONT_SECTIONS: Record<StorefrontSection, StorefrontSectionConfig> = {
  best_offers: {
    section: "best_offers",
    title: "Les Meilleures Offres",
    description:
      "Produits affichés dans la section « Les Meilleures Offres » de l'accueil. Le premier apparaît en grande carte, les suivants en petites cartes.",
    max: 5,
    slotLabel: (index) => (index === 0 ? "Grande carte" : null),
    labelField: null,
  },
  new_arrivals: {
    section: "new_arrivals",
    title: "Nouveautés",
    description:
      "Produits affichés dans la section « Nouveautés ». Le premier occupe la grande carte, le deuxième la carte large, les deux suivants les petites cartes.",
    max: 4,
    slotLabel: (index) => ["Grande carte", "Carte large", "Petite carte", "Petite carte"][index] ?? null,
    labelField: {
      name: "Accroche",
      placeholder: "Nouvelle Gamme Sécurité Totale",
      help: "Texte mis en avant sur la grande carte uniquement.",
    },
  },
  style_picks: {
    section: "style_picks",
    title: "Choisissez Votre Style",
    description:
      "Produits du carrousel « Choisissez Votre Style ». La description courte, les images et le prix viennent de la fiche produit.",
    max: 7,
    slotLabel: () => null,
    labelField: {
      name: "Badge",
      placeholder: "Meilleure Vente",
      help: "Petit badge affiché en haut à droite de la carte (facultatif).",
    },
  },
}
