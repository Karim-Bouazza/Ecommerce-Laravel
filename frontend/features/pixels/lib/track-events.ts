let pixelsReady = false
const pendingEvents: Array<() => void> = []
let facebookPixelIds: string[] = []

export function setFacebookPixelIds(ids: string[]) {
  facebookPixelIds = ids
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.startsWith("0") ? `213${digits.slice(1)}` : digits
}

function dispatch(fire: () => void) {
  if (pixelsReady) fire()
  else pendingEvents.push(fire)
}

export function markPixelsReady() {
  pixelsReady = true
  pendingEvents.splice(0).forEach((fire) => fire())
}

export type TrackInitiateCheckoutParams = {
  id: number | string
  name: string
  value: number
  quantity: number
  currency?: string
}

function fireInitiateCheckout({
  id,
  name,
  value,
  quantity,
  currency = "DZD",
}: TrackInitiateCheckoutParams) {
  const contentId = String(id)

  window.fbq?.("track", "InitiateCheckout", {
    content_ids: [contentId],
    content_name: name,
    content_type: "product",
    num_items: quantity,
    value,
    currency,
  })

  window.gtag?.("event", "begin_checkout", {
    currency,
    value,
    items: [
      {
        item_id: contentId,
        item_name: name,
        quantity,
      },
    ],
  })
}

export type TrackPurchaseParams = {
  orderId: number | string
  productId: number | string
  productName: string
  value: number
  quantity: number
  currency?: string
  customer?: {
    phone: string
    firstName: string
    lastName: string
  }
}

function firePurchase({
  orderId,
  productId,
  productName,
  value,
  quantity,
  currency = "DZD",
  customer,
}: TrackPurchaseParams) {
  const contentId = String(productId)
  const transactionId = String(orderId)

  if (customer) {
    const userData = {
      ph: normalizePhone(customer.phone),
      fn: customer.firstName.trim().toLowerCase(),
      ln: customer.lastName.trim().toLowerCase(),
    }
    facebookPixelIds.forEach((id) => window.fbq?.("init", id, userData))
  }

  window.fbq?.(
    "track",
    "Purchase",
    {
      content_ids: [contentId],
      content_name: productName,
      content_type: "product",
      num_items: quantity,
      value,
      currency,
    },
    { eventID: `order-${transactionId}` }
  )

  window.gtag?.("event", "purchase", {
    transaction_id: transactionId,
    currency,
    value,
    items: [
      {
        item_id: contentId,
        item_name: productName,
        quantity,
      },
    ],
  })
}

export type TrackViewContentParams = {
  id: number | string
  name: string
  price: number
  category?: string | null
  currency?: string
}

function fireViewContent({ id, name, price, category, currency = "DZD" }: TrackViewContentParams) {
  const contentId = String(id)

  window.fbq?.("track", "ViewContent", {
    content_ids: [contentId],
    content_name: name,
    content_type: "product",
    content_category: category ?? undefined,
    value: price,
    currency,
  })

  window.gtag?.("event", "view_item", {
    currency,
    value: price,
    items: [
      {
        item_id: contentId,
        item_name: name,
        item_category: category ?? undefined,
        price,
      },
    ],
  })
}

export function trackInitiateCheckout(params: TrackInitiateCheckoutParams) {
  dispatch(() => fireInitiateCheckout(params))
}

export function trackPurchase(params: TrackPurchaseParams) {
  dispatch(() => firePurchase(params))
}

export function trackViewContent(params: TrackViewContentParams) {
  dispatch(() => fireViewContent(params))
}
