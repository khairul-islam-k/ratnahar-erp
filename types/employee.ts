import { QueryType } from "./gallery";

export type UserType = "EMPLOYEE"; // add other roles as needed, e.g. | "ADMIN" | "CUSTOMER"
export type UserStatus = 
|'ACTIVE'
|'INACTIVE'
|'SUSPENDED';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  status: UserStatus;
  photo: string;
  tenantId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export type CreateEmployeePayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  photo?: string;
};

export type EmployeeQuery = QueryType & {
  search?: string;
  status?: UserStatus;
}
