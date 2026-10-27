'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api';
import { usePurchaseSubscriptionMutation, useSubscriptionQuery } from '@/lib/api/hooks/subscription';
import { toast } from '@/lib/toast';

type BillingPeriod = 'monthly' | 'yearly';

const UpgratePlan = () => {
  const { data, isPending, isError, error } = useSubscriptionQuery();
  const purchaseSubscription = usePurchaseSubscriptionMutation();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const handleChoosePlan = async (packageId: string) => {
    try {
      await purchaseSubscription.mutateAsync({
        packageId,
        billingCycle: billingPeriod,
        autoRenew: true,
      });
      toast.success('Subscription purchased successfully');
    } catch (purchaseError) {
      toast.error(getApiErrorMessage(purchaseError));
    }
  };

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Subscription packages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the subscription packages available to your business.
        </p>
        <div className="mt-4 inline-flex rounded-lg border bg-muted p-1" aria-label="Billing period">
          <Button
            type="button"
            size="sm"
            variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
            aria-pressed={billingPeriod === 'monthly'}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </Button>
          <Button
            type="button"
            size="sm"
            variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
            aria-pressed={billingPeriod === 'yearly'}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
          </Button>
        </div>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading subscription packages...</p>
      ) : isError ? (
        <p className="text-sm text-destructive" role="alert">
          Could not load subscription packages: {error.message}
        </p>
      ) : data.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subscription packages found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {data.data.map((subscription) => {
            const price = billingPeriod === 'monthly' ? subscription.monthlyPrice : subscription.yearlyPrice;

            return (
              <article key={subscription.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold">{subscription.name}</h2>
                  <p className="text-sm text-muted-foreground">{subscription.slug}</p>
                </div>

                {subscription.description && (
                  <p className="mt-4 text-sm text-muted-foreground">{subscription.description}</p>
                )}

                <div className="mt-5 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    {billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} billing
                  </p>
                  <p className="text-xl font-semibold">
                    ৳{Number(price).toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      / {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-medium">Included modules</h3>
                  {subscription.modules.length ? (
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {subscription.modules.map((module) => (
                        <li key={module.id}>{module.moduleKey}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">No modules listed.</p>
                  )}
                </div>

                <Button
                  type="button"
                  className="mt-6 w-full cursor-pointer"
                  disabled={purchaseSubscription.isPending}
                  onClick={() => handleChoosePlan(subscription.id)}
                >
                  {purchaseSubscription.isPending ? 'Processing...' : 'Choose plan'}
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default UpgratePlan;
