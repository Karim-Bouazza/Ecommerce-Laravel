import Link from "next/link"
import {
  ChevronRight,
  GalleryHorizontal,
  Globe,
  Image as ImageIcon,
  Languages,
  LayoutGrid,
  Megaphone,
  PackagePlus,
  Palette,
  Sparkles,
  Tag,
} from "lucide-react"

import { SettingsPageShell } from "@/features/site-settings/components/settings-page-shell"

const SECTIONS = [
  {
    href: "/admin/website/colors",
    icon: Palette,
    title: "Couleurs",
    description: "Thème de la boutique : boutons, liens, dégradés et badges.",
  },
  {
    href: "/admin/website/logo",
    icon: ImageIcon,
    title: "Logo",
    description: "Logo affiché dans l'en-tête de la boutique.",
  },
  {
    href: "/admin/website/language",
    icon: Languages,
    title: "Langue",
    description: "Langue principale de la boutique (français ou arabe).",
  },
  {
    href: "/admin/website/hero-categories",
    icon: LayoutGrid,
    title: "Catégories de l'accueil",
    description: "Catégories et images mises en avant en haut de l'accueil.",
  },
  {
    href: "/admin/website/best-offers",
    icon: Tag,
    title: "Meilleures offres",
    description: "Produits affichés dans la section « Les Meilleures Offres ».",
  },
  {
    href: "/admin/website/features",
    icon: Sparkles,
    title: "Nos atouts",
    description: "Cartes avec image de la section « Nos Atouts ».",
  },
  {
    href: "/admin/website/new-arrivals",
    icon: PackagePlus,
    title: "Nouveautés",
    description: "Produits de la section « Nouveautés » et leur accroche.",
  },
  {
    href: "/admin/website/style-picks",
    icon: GalleryHorizontal,
    title: "Votre style",
    description: "Produits et badges du carrousel « Choisissez Votre Style ».",
  },
  {
    href: "/admin/website/promo-banners",
    icon: Megaphone,
    title: "Bannières promo",
    description: "Grandes bannières promotionnelles avec image et bouton.",
  },
]

export default function Page() {
  return (
    <SettingsPageShell
      icon={Globe}
      title="Site Web"
      description="Contrôlez l'apparence et le contenu de votre boutique en ligne."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex cursor-pointer flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <div className="flex items-center justify-between">
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <Icon className="size-5" />
              </span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </SettingsPageShell>
  )
}
