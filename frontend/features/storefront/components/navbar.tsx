"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useStorefrontLogo } from "@/features/storefront/lib/logo-context"

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
      </div>
    </header>
  )
}
