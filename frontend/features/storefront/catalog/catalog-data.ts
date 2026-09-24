// TODO: remplacer par les données de l'API catalogue
export type FilterOption = { value: string; label: string }
export type ColorOption = FilterOption & { swatch: string }

export type CatalogProduct = {
  id: string
  name: string
  category: string
  brand: string
  color: string
  connectivity: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  image: string
}

export const CATEGORY_OPTIONS: FilterOption[] = [
  { value: "cctv-cameras", label: "Caméras CCTV" },
  { value: "alarm-systems", label: "Systèmes d'alarme" },
  { value: "access-control", label: "Contrôle d'accès" },
  { value: "video-intercoms", label: "Interphones vidéo" },
  { value: "sensors-detectors", label: "Capteurs & détecteurs" },
]

export const BRAND_OPTIONS: FilterOption[] = [
  { value: "hikvision", label: "Hikvision" },
  { value: "dahua", label: "Dahua" },
  { value: "ajax", label: "Ajax" },
  { value: "zkteco", label: "ZKTeco" },
  { value: "uniview", label: "Uniview" },
]

// Seuils « X et plus » pour le filtre de note
export const RATING_OPTIONS = [4.5, 4, 3] as const

export const COLOR_OPTIONS: ColorOption[] = [
  { value: "black", label: "Noir", swatch: "#1f1f1f" },
  { value: "white", label: "Blanc", swatch: "#ffffff" },
  { value: "grey", label: "Gris", swatch: "#9ca3af" },
  { value: "silver", label: "Argent", swatch: "linear-gradient(135deg,#f1f5f9,#94a3b8)" },
]

export const CONNECTIVITY_OPTIONS: FilterOption[] = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "poe", label: "PoE" },
  { value: "wired", label: "Filaire" },
  { value: "4g", label: "4G / LTE" },
  { value: "zigbee", label: "Zigbee" },
]

export const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: "in-stock", label: "En stock" },
  { value: "out-of-stock", label: "Rupture de stock" },
]

export const SORT_OPTIONS = [
  { value: "featured", label: "Recommandés" },
  { value: "new", label: "Nouveautés" },
  { value: "popular", label: "Les plus populaires" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

const image = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "p1", name: "Caméra dôme HD 4 MP", category: "cctv-cameras", brand: "hikvision", color: "white", connectivity: "poe", price: 8900, originalPrice: 11500, rating: 4.9, reviews: 212, inStock: true, image: image("dome-cctv-camera") },
  { id: "p2", name: "Caméra bullet extérieure 4K", category: "cctv-cameras", brand: "hikvision", color: "white", connectivity: "poe", price: 14500, rating: 4.8, reviews: 164, inStock: true, isNew: true, image: image("bullet-4k-camera") },
  { id: "p3", name: "Caméra Wi-Fi intérieure 360°", category: "cctv-cameras", brand: "hikvision", color: "white", connectivity: "wifi", price: 5200, originalPrice: 6500, rating: 4.6, reviews: 389, inStock: true, image: image("wifi-360-camera") },
  { id: "p4", name: "Caméra solaire 4G autonome", category: "cctv-cameras", brand: "dahua", color: "grey", connectivity: "4g", price: 24900, rating: 4.7, reviews: 58, inStock: false, isNew: true, image: image("solar-4g-camera") },
  { id: "p5", name: "Enregistreur NVR 8 canaux", category: "cctv-cameras", brand: "uniview", color: "black", connectivity: "wired", price: 32000, originalPrice: 38000, rating: 4.8, reviews: 97, inStock: true, image: image("nvr-recorder-8ch") },
  { id: "p6", name: "Kit alarme sans fil Pro", category: "alarm-systems", brand: "ajax", color: "white", connectivity: "wifi", price: 27500, originalPrice: 31000, rating: 4.7, reviews: 143, inStock: true, image: image("wireless-alarm-panel") },
  { id: "p7", name: "Centrale d'alarme hybride 4G", category: "alarm-systems", brand: "ajax", color: "black", connectivity: "4g", price: 41000, rating: 4.9, reviews: 41, inStock: true, isNew: true, image: image("hybrid-alarm-4g") },
  { id: "p8", name: "Sirène extérieure flash", category: "alarm-systems", brand: "ajax", color: "grey", connectivity: "zigbee", price: 6800, rating: 4.4, reviews: 76, inStock: false, image: image("outdoor-siren-flash") },
  { id: "p9", name: "Lecteur de badge RFID", category: "access-control", brand: "zkteco", color: "black", connectivity: "wired", price: 9500, rating: 4.6, reviews: 88, inStock: true, image: image("access-control-reader") },
  { id: "p10", name: "Serrure connectée à empreinte", category: "access-control", brand: "zkteco", color: "silver", connectivity: "wifi", price: 23500, originalPrice: 27000, rating: 4.9, reviews: 254, inStock: true, image: image("smart-door-lock") },
  { id: "p11", name: "Terminal biométrique facial", category: "access-control", brand: "zkteco", color: "black", connectivity: "poe", price: 58000, rating: 4.8, reviews: 33, inStock: true, isNew: true, image: image("face-terminal") },
  { id: "p12", name: "Interphone vidéo 7 pouces", category: "video-intercoms", brand: "hikvision", color: "silver", connectivity: "wired", price: 18900, originalPrice: 21000, rating: 5.0, reviews: 121, inStock: true, image: image("video-door-intercom") },
  { id: "p13", name: "Sonnette vidéo Wi-Fi", category: "video-intercoms", brand: "dahua", color: "black", connectivity: "wifi", price: 11200, rating: 4.5, reviews: 302, inStock: true, image: image("wifi-doorbell") },
  { id: "p14", name: "Détecteur de mouvement PIR", category: "sensors-detectors", brand: "ajax", color: "white", connectivity: "zigbee", price: 3500, originalPrice: 4200, rating: 4.6, reviews: 418, inStock: true, image: image("pir-motion-sensor") },
  { id: "p15", name: "Détecteur bris de vitre", category: "sensors-detectors", brand: "ajax", color: "white", connectivity: "zigbee", price: 4800, rating: 4.5, reviews: 67, inStock: false, image: image("glass-break-detector") },
  { id: "p16", name: "Détecteur de fumée connecté", category: "sensors-detectors", brand: "dahua", color: "white", connectivity: "wifi", price: 5900, rating: 4.7, reviews: 186, inStock: true, isNew: true, image: image("smoke-detector-smart") },
]

export const PRICE_BOUNDS: [number, number] = [
  Math.floor(Math.min(...CATALOG_PRODUCTS.map((p) => p.price)) / 1000) * 1000,
  Math.ceil(Math.max(...CATALOG_PRODUCTS.map((p) => p.price)) / 1000) * 1000,
]
export const PRICE_STEP = 500
