import type { PaginationMeta } from "../src/lib/api/response";
import { QueryType } from "./gallery";

export interface RoleResponse {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleListResponse {
  data: RoleResponse[];
  meta: PaginationMeta;
  message: string;
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description: string;
  isSystemRole: boolean;
}

export type UpdateRolePayload = Partial<CreateRolePayload>;

export type AssignRoleToUserPayload = {
  roleId: string;
};

export type RoleQuery = QueryType & {
  search?: string;
}

export type AssignRolePermissionPayload = {
  roleId: string;
  data: {
    permissionId: string;
  }[];
};

export type RolePermission = {
  roleId: string;
  permissionId: string;
  id: string;
};

// permission

export const RbacFeature = {
  Gallery: "Gallery",
  Permission: "Permission",
  Employees: "Employees",
} as const;
export type RbacFeature = (typeof RbacFeature)[keyof typeof RbacFeature];

export const PermissionAction = {
  read: "read",
  create: "create",
  update: "update",
  delete: "delete"
} as const;
export type PermissionAction =
  (typeof PermissionAction)[keyof typeof PermissionAction];
