import { api, toApiError } from "@/lib/api"
import type { DeliveryCompanyIntegrationSchema } from "@/features/partners/schemas/delivery-company-integration-schema"
import type {
  DeliveryCompanyIntegration,
  DeliveryCompanyIntegrationListItem,
} from "@/features/partners/types"

export async function getDeliveryCompanyIntegrations(): Promise<
  DeliveryCompanyIntegrationListItem[]
> {
  try {
    const { data } = await api.get<{ data: DeliveryCompanyIntegrationListItem[] }>(
      "/api/v1/partners/integrations"
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getDeliveryCompanyIntegration(
  companyKey: string
): Promise<DeliveryCompanyIntegration> {
  try {
    const { data } = await api.get<{ data: DeliveryCompanyIntegration }>(
      `/api/v1/partners/integrations/${companyKey}`
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function saveDeliveryCompanyIntegration(
  companyKey: string,
  payload: DeliveryCompanyIntegrationSchema
): Promise<DeliveryCompanyIntegration> {
  try {
    const { data } = await api.put<{ data: DeliveryCompanyIntegration }>(
      `/api/v1/partners/integrations/${companyKey}`,
      payload
    )
    return data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteDeliveryCompanyIntegration(companyKey: string): Promise<void> {
  try {
    await api.delete(`/api/v1/partners/integrations/${companyKey}`)
  } catch (error) {
    throw toApiError(error)
  }
}
