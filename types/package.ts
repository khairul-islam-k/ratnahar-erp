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

export type PackageQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: PackageStatus;
};
