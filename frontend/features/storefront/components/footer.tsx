"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

type FooterGroup = { title: string; links: { label: string; href: string }[] }

// Each inner array is one column; groups inside a column stack vertically.
const FOOTER_COLUMNS: FooterGroup[][] = [
  [
    {
      title: "Produits",
      links: [
        { label: "Caméras", href: "/products?category=cctv-cameras" },
        { label: "Alarmes", href: "/products?category=alarm-systems" },
      ],
    },
    {
      title: "En vedette",
      links: [
        { label: "Nouveautés", href: "/products?sort=new" },
        { label: "Promotions", href: "/products?sale=1" },
        { label: "Meilleures ventes", href: "/products?sort=popular" },
      ],
    },
  ],
  [
    {
      title: "Catégories",
      links: [
        { label: "Caméras CCTV", href: "/categories/cctv-cameras" },
        { label: "Systèmes d'alarme", href: "/categories/alarm-systems" },
        { label: "Contrôle d'accès", href: "/categories/access-control" },
        { label: "Interphones vidéo", href: "/categories/video-intercoms" },
        { label: "Capteurs & détecteurs", href: "/categories/sensors-detectors" },
        { label: "Toutes les catégories", href: "/categories" },
      ],
    },
  ],
  [
    {
      title: "Légal",
      links: [
        { label: "Politique de confidentialité", href: "/privacy" },
        { label: "Conditions générales", href: "/terms" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contactez-nous", href: "/contact" },
        { label: "Donner votre avis", href: "/feedback" },
        { label: "Centre d'aide", href: "/help" },
      ],
    },
  ],
]

function NewsletterCard() {
  const [email, setEmail] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: brancher sur l'API newsletter
    toast.success("Merci ! Vous êtes inscrit à notre newsletter.")
    setEmail("")
  }

  return (
    <div className="mt-8 max-w-md rounded-2xl bg-background p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h3 className="text-xl leading-snug font-semibold">
          Ne ratez pas
          <br />
          nos offres !
        </h3>
        <p className="text-xs text-muted-foreground sm:max-w-44">
          Laissez votre e-mail ci-dessous et recevez nos meilleures offres en
          avant-première.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex items-end gap-4">
        <label htmlFor="footer-newsletter" className="sr-only">
          Adresse e-mail
        </label>
        <input
          id="footer-newsletter"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="votre@email.com"
          className="min-w-0 flex-1 border-b border-border bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105"
        >
          S&apos;abonner
        </button>
      </form>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-8 rounded-t-3xl bg-muted/60 text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center" aria-label="CodAvenir">
            <Image
              src="/logo.png"
              alt=""
              width={2172}
              height={724}
              className="h-14 w-auto dark:hidden"
            />
            <Image
              src="/logo-dark.png"
              alt=""
              width={2172}
              height={724}
              className="hidden h-14 w-auto dark:block"
            />
          </Link>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Des solutions de sécurité intelligentes pour protéger votre maison
            et votre entreprise, livrées et installées en toute simplicité.
          </p>
          <NewsletterCard />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-12">
          {FOOTER_COLUMNS.map((groups, index) => (
            <div key={index} className="flex flex-col gap-10">
              {groups.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          Copyright © {new Date().getFullYear()} CodAvenir. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
