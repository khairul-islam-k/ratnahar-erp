export type PackageStatus = "active" | "inactive";
export type PackagePricingType = "fixed" | "custom";

export interface PackageModule {
  id: string;
  packageId: string;
  moduleKey: string;
  isEnabled: boolean;
}

export interface PackageLimit {
  id: string;
  packageId: string;
  limitKey: string;
  limitValue: number;
}

export interface PackageResponse {
  id: string;
  name: string;
  slug: string;
  pricingType: PackagePricingType;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string | null;
  status: PackageStatus;
  modules: PackageModule[];
  limits: PackageLimit[];
}

export interface PackageModuleInput {
  moduleKey: string;
  isEnabled: boolean;
}

export interface PackageLimitInput {
  limitKey: string;
  limitValue: number;
}

export interface PackagePayload {
  name: string;
  slug: string;
  pricingType: PackagePricingType;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  status: PackageStatus;
  modules: PackageModuleInput[];
  limits: PackageLimitInput[];
}

export type CreatePackagePayload = PackagePayload;
export type UpdatePackagePayload = PackagePayload;

export type PackageQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: PackageStatus;
};
