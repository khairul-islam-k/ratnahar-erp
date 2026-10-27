import type { PackageResponse } from "../../../types/package";
import { api } from "../api";
import type { ApiResponse } from "./response";

export type PurchaseSubscriptionPayload = {
  packageId: string;
  billingCycle: "monthly" | "yearly";
  autoRenew: boolean;
};

// The subscription endpoint returns the available packages in its data array.
export const subscriptionApi = {
  get() {
    return api.get<ApiResponse<PackageResponse[]>>("/subscription").then((res) => res.data);
  },

  purchase(payload: PurchaseSubscriptionPayload) {
    return api.post<ApiResponse<unknown>>("/subscription", payload).then((res) => res.data);
  },
};
