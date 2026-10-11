import { api, toApiError } from "@/lib/api";
import type {
  Administrator,
  AdministratorRole,
  AdministratorStatusFilter,
  PaginatedResponse,
} from "@/features/administrators/types";

export type GetAdministratorsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role_id?: number;
  status?: AdministratorStatusFilter;
};

export type AdministratorPayload = {
  name: string;
  email: string;
  phone?: string;
  role_id: number;
  password?: string;
  password_confirmation?: string;
  is_active: boolean;
};

export async function getAdministrators(
  params: GetAdministratorsParams,
): Promise<PaginatedResponse<Administrator>> {
  try {
    const { data } = await api.get<PaginatedResponse<Administrator>>(
      "/api/v1/administrators",
      { params },
    );
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getAdministratorRoleOptions(): Promise<
  AdministratorRole[]
> {
  try {
    const { data } = await api.get<AdministratorRole[]>(
      "/api/v1/administrators/role-options",
    );
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createAdministrator(
  payload: AdministratorPayload,
): Promise<Administrator> {
  try {
    const { data } = await api.post<{ data: Administrator }>(
      "/api/v1/administrators",
      payload,
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateAdministrator(
  id: number,
  payload: AdministratorPayload,
): Promise<Administrator> {
  try {
    const { data } = await api.put<{ data: Administrator }>(
      `/api/v1/administrators/${id}`,
      payload,
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function toggleAdministratorActive(
  id: number,
): Promise<Administrator> {
  try {
    const { data } = await api.post<{ data: Administrator }>(
      `/api/v1/administrators/${id}/toggle-active`,
    );
    return data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteAdministrator(id: number): Promise<void> {
  try {
    await api.delete(`/api/v1/administrators/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
