"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "../subscription";
import { queryKeys } from "../query-keys";

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: queryKeys.subscription.all,
    queryFn: () => subscriptionApi.get(),
  });
}

export function usePurchaseSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.purchase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subscription.all }),
  });
}
