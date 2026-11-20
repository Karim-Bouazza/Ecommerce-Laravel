import { api, toApiError } from "@/lib/api"
import type { MetaConnection, MetaDateRange, MetaSpend } from "@/features/meta-ads/types"

export async function getMetaConnection(): Promise<MetaConnection> {
  try {
    const { data } = await api.get<{ data: MetaConnection }>("/api/v1/meta/connection")
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function saveMetaApp(payload: {
  app_id: string
  app_secret?: string
}): Promise<MetaConnection> {
  try {
    const { data } = await api.put<{ data: MetaConnection }>("/api/v1/meta/app", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getMetaAuthUrl(redirectUri: string): Promise<string> {
  try {
    const { data } = await api.get<{ data: { url: string } }>("/api/v1/meta/connect", {
      params: { redirect_uri: redirectUri },
    })
    return data.data.url
  } catch (error) {
    throw toApiError(error)
  }
}

export async function completeMetaCallback(payload: {
  code: string
  state: string
}): Promise<MetaConnection> {
  try {
    const { data } = await api.post<{ data: MetaConnection }>("/api/v1/meta/callback", payload)
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function selectMetaAdAccount(adAccountId: string): Promise<MetaConnection> {
  try {
    const { data } = await api.put<{ data: MetaConnection }>("/api/v1/meta/ad-account", {
      ad_account_id: adAccountId,
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function testMetaConnection(): Promise<{ ok: boolean; name: string | null }> {
  try {
    const { data } = await api.post<{ data: { ok: boolean; name: string | null } }>(
      "/api/v1/meta/test"
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function disconnectMeta(): Promise<void> {
  try {
    await api.delete("/api/v1/meta/connection")
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getMetaSpend(range: MetaDateRange, fresh = false): Promise<MetaSpend> {
  try {
    const { data } = await api.get<{ data: MetaSpend }>("/api/v1/meta/spend", {
      params: { ...range, fresh: fresh ? 1 : 0 },
    })
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function linkMetaCampaign(
  campaignId: string,
  payload: { name: string; product_id: number | null }
): Promise<void> {
  try {
    await api.put(`/api/v1/meta/campaigns/${campaignId}`, payload)
  } catch (error) {
    throw toApiError(error)
  }
}
