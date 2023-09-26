import { Subscription } from 'rxjs';

export interface SubscriptionsLifecycle {
  subscriptionsList: Subscription[];

  ngOnInit(): void;
  ngOnDestroy(): void;

  /**
   * Subscribes to the provided subscription and adds it to the list.
   */
  _setSubscriptions(): void;

  /**
   * Unsubscribes from all the subscriptions in the list.
   */
  _completeSubscriptions(): void;
}
