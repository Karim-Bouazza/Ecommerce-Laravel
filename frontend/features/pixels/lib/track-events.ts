// Pixel base scripts load only after the active-pixels request resolves, so events fired earlier
// (e.g. ViewContent on the landing page) would hit an undefined window.fbq and be lost.
// They are buffered here until TrackingPixels has initialized the pixels and sent the first PageView.
let pixelsReady = false
const pendingEvents: Array<() => void> = []

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

  window.ttq?.track("InitiateCheckout", {
    content_id: contentId,
    content_name: name,
    content_type: "product",
    quantity,
    value,
    currency,
  })

  window.snaptr?.("track", "START_CHECKOUT", {
    item_ids: [contentId],
    number_items: quantity,
    price: value,
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
}

function firePurchase({
  orderId,
  productId,
  productName,
  value,
  quantity,
  currency = "DZD",
}: TrackPurchaseParams) {
  const contentId = String(productId)
  const transactionId = String(orderId)

  window.fbq?.("track", "Purchase", {
    content_ids: [contentId],
    content_name: productName,
    content_type: "product",
    num_items: quantity,
    value,
    currency,
  })

  window.ttq?.track("CompletePayment", {
    content_id: contentId,
    content_name: productName,
    content_type: "product",
    quantity,
    value,
    currency,
  })

  window.snaptr?.("track", "PURCHASE", {
    item_ids: [contentId],
    number_items: quantity,
    price: value,
    currency,
    transaction_id: transactionId,
  })

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

  window.ttq?.track("ViewContent", {
    content_id: contentId,
    content_name: name,
    content_type: "product",
    value: price,
    currency,
  })

  window.snaptr?.("track", "VIEW_CONTENT", {
    item_ids: [contentId],
    item_category: category ?? undefined,
    price,
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
