const priceFormatter = new Intl.NumberFormat("fr-FR")

export function formatPrice(value: number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null
  }
  return `${priceFormatter.format(value)} DZD`
}
