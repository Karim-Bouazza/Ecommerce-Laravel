// TODO: remplacer par les données de l'API produit / livraison
export type ProductDetail = {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  stock: number
  shortDescription: string
  description: string[]
  specs: { label: string; value: string }[]
  tags: string[]
  images: string[]
}

const image = (seed: string) => `https://picsum.photos/seed/${seed}/900/900`

export const MOCK_PRODUCT: ProductDetail = {
  id: "p2",
  sku: "HIK-BLT-4K-2026",
  name: "Caméra bullet extérieure 4K",
  category: "Caméras CCTV",
  brand: "Hikvision",
  price: 14500,
  originalPrice: 17900,
  rating: 4.8,
  reviews: 164,
  stock: 23,
  shortDescription:
    "Caméra 8 MP étanche IP67 avec vision nocturne couleur jusqu'à 40 m, détection humain/véhicule et alimentation PoE. Idéale pour façades, parkings et entrepôts.",
  description: [
    "Surveillez l'extérieur de votre maison ou de votre commerce avec une image 4K nette de jour comme de nuit. La technologie ColorVu conserve les couleurs même dans l'obscurité grâce à un éclairage d'appoint discret.",
    "L'analyse intelligente distingue les personnes et les véhicules pour réduire les fausses alertes. Un seul câble réseau (PoE) suffit pour l'alimentation et la vidéo.",
  ],
  specs: [
    { label: "Résolution", value: "8 MP (3840 × 2160)" },
    { label: "Objectif", value: "2,8 mm – angle 105°" },
    { label: "Vision nocturne", value: "Couleur, jusqu'à 40 m" },
    { label: "Étanchéité", value: "IP67" },
    { label: "Alimentation", value: "PoE (802.3af) / 12 V DC" },
    { label: "Garantie", value: "12 mois" },
  ],
  tags: ["Caméra", "Extérieur", "4K", "PoE", "Vision nocturne"],
  images: [
    image("bullet-4k-camera"),
    image("bullet-4k-camera-side"),
    image("bullet-4k-camera-night"),
    image("bullet-4k-camera-mount"),
  ],
}

// TODO: brancher sur l'API produit
export function getProduct(id: string): ProductDetail {
  return { ...MOCK_PRODUCT, id }
}

export type DeliveryType = "home" | "stopdesk"

export type MockWilaya = { id: number; name: string }

export const WILAYAS: MockWilaya[] = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
].map((name, index) => ({ id: index + 1, name }))

// Wilayas du Grand Sud : tarif de livraison majoré
const SOUTH_WILAYAS = new Set([1, 8, 11, 33, 37, 49, 50, 52, 53, 54, 56])

export function getDeliveryPrice(wilayaId: number | null, type: DeliveryType): number | null {
  if (wilayaId === null) return null
  if (wilayaId === 16) return type === "home" ? 400 : 250
  if (SOUTH_WILAYAS.has(wilayaId)) return type === "home" ? 1400 : 900
  return type === "home" ? 700 : 450
}

export const MAX_ORDER_QUANTITY = 10
