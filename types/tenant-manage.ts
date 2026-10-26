import type { QueryType } from "./gallery";

export type TenantManageStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface TenantManageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "TENANT";
  status: TenantManageStatus;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantManageDetail extends TenantManageRecord {
  emailVerifiedAt: string | null;
  tenantId: string;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
  deletedAt: string | null;
  businessName: string;
}

export interface CreateTenantPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  photo: string;
}

export type UpdateTenantPayload = Omit<CreateTenantPayload, "password"> & {
  password?: string;
  status: TenantManageStatus;
};

export type TenantManageQuery = QueryType & {
  status?: TenantManageStatus;
  search?: string;
};
