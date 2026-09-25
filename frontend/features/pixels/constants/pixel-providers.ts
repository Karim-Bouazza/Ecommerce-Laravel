import type { PixelProvider } from "@/features/pixels/types"

export const PIXEL_PROVIDERS: { value: PixelProvider; label: string }[] = [
  { value: "facebook", label: "Meta (Facebook)" },
  { value: "tiktok", label: "TikTok" },
  { value: "snapchat", label: "Snapchat" },
  { value: "google", label: "Google" },
]

export function pixelProviderLabel(provider: PixelProvider): string {
  return PIXEL_PROVIDERS.find((option) => option.value === provider)?.label ?? provider
}
