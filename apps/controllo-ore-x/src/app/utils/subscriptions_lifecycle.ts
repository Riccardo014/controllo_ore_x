import { Subscription } from 'rxjs';

export interface SubscriptionsLifecycle {
  subscriptionsList: Subscription[];

  ngOnInit(): void;
  ngOnDestroy(): void;

  /**
   * Subscribes to the provided subscription and adds it to the list.
   */
  setSubscriptions(): void;

  /**
   * Unsubscribes from all the subscriptions in the list.
   * Should use @see {@link completeSubscriptions}
   */
  completeSubscriptions: typeof completeSubscriptions;
}

/**
 * Iterate through the subscriptionsList and unsubscribe from each subscription in the list.
 */
export const completeSubscriptions = (
  subscriptionsList: Subscription[],
): void => {
  for (const subscription of subscriptionsList) {
    subscription.unsubscribe();
  }
};
