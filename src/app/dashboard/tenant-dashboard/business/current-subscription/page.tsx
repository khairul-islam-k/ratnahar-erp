"use client";

import { useSubscriptionQuery } from "@/lib/api/hooks/subscription";

const CurrentSubscription = () => {
  const { data, isPending, isError, error } = useSubscriptionQuery();

  return (
    <section>
      current subscription
    </section>
  );
};

export default CurrentSubscription;
