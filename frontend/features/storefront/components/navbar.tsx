"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Package, Search, ShoppingBag, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStorefrontLogo } from "@/features/storefront/lib/logo-context"

// TODO: remplacer par les données réelles (session + panier)
const CURRENT_USER = {
  name: "Karim Bouazza",
  avatar: "https://picsum.photos/seed/codavenir-user/80/80",
}
const CART_COUNT = 2
const HAS_NOTIFICATIONS = true

function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = query.trim()
    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products")
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-xl">
      <label htmlFor="navbar-search" className="sr-only">
        Rechercher un produit
      </label>
      <input
        id="navbar-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Essayez "Caméra 4K extérieure"'
        className="h-11 w-full rounded-full border border-border bg-background pr-12 pl-5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/40"
      />
      <button
        type="submit"
        aria-label="Rechercher"
        className="absolute top-1/2 right-4 -translate-y-1/2 text-foreground transition-colors hover:text-primary"
      >
        <Search className="size-5" />
      </button>
    </form>
  )
}

export function Navbar() {
  const logoUrl = useStorefrontLogo()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:gap-8 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="CodAvenir">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-12 w-auto object-contain" />
          ) : (
            <>
              <Image
                src="/logo.png"
                alt=""
                width={2172}
                height={724}
                priority
                className="h-12 w-auto dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt=""
                width={2172}
                height={724}
                priority
                className="hidden h-12 w-auto dark:block"
              />
            </>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <Bell className="size-5" />
            {HAS_NOTIFICATIONS && (
              <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 ring-2 ring-background" />
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Panier, ${CART_COUNT} articles`}
            className="flex h-10 items-center gap-2 rounded-full bg-muted px-3 text-sm font-semibold transition-colors hover:bg-muted/70 sm:px-4"
          >
            <ShoppingBag className="size-4" />
            <span>
              {CART_COUNT}
              <span className="hidden sm:inline"> articles</span>
            </span>
          </Link>

          <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full p-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:pr-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CURRENT_USER.avatar}
                alt=""
                className="size-8 rounded-full object-cover"
              />
              <span className="hidden text-sm font-semibold sm:inline">
                {CURRENT_USER.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem render={<Link href="/profile" />}>
                <User />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/orders" />}>
                <Package />
                Mes commandes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* TODO: brancher sur la déconnexion */}
              <DropdownMenuItem variant="destructive">
                <LogOut />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
