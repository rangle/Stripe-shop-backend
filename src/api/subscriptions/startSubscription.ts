import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';

import { customerCreate } from '../../services/stripe/customerCreate';
import { subscriptionCreate } from '../../services/stripe/subscriptionCreate';
import { StripeSubscriptionItems } from '../../types';
import { getCustomerOrdersPaid } from '../../services/db/customerOrderUtils';
import { columnMapShopping, itemTypes } from '../../utils/constants/shopping_entity_constants';
import { getCustomerById } from '../../services/db/customers/getCustomer';
import { setCustomer } from '../../services/db/customers/setCustomer';

export const startSubscription: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,

) => {
    /**
     * @todo pass in an optional "Product ID" if users want to setup a Specific Product
     * This could be done here, as Subscriptions are typically managed 1 at a time.
     */
  const { customerId }: any = JSON.parse((event as APIGatewayEvent).body);

    try {
        // Check if Customer exists
    const customer = await getCustomerById(customerId);
        if (! customer) {
            return errorHandler(
                'ERROR startSubscription FAILED!',
        'The customer was not found'
            );
    }

        // Check if Customer has any Subscriptions
    const items: any = await getCustomerOrdersPaid(customerId);
        if (! items.length) {
      return errorHandler('ERROR startSubscription FAILED!', 'Your Cart is empty');
    }
        // filter items for Subscriptions.
    const subscriptions = items.filter(
      (item) => item[columnMapShopping.itemType] == itemTypes.subscription
    );
    if (!subscriptions.length) {
            return errorHandler(
                'ERROR startSubscription FAILED!',
        'Your Cart has no Subscriptions'
            );
    }

        const keyedItems = items.reduce((acc: any, item) => {
      acc[item.productId] = item;
            return acc;
        }, {});

    const customerSubs: StripeSubscriptionItems[] = subscriptions.map((item) => ({
            price: item.stripePriceId,
            quantity: keyedItems[item.productId].quantity,
        }));

        // Check if customer has a Stripe Customer ID, if not get one.
        if (! customer.StripeCustomerId) {
            // If our customer hasn't been saved to Stripe, do that now.
            const stripeCustomer = await customerCreate(customer);
            customer.StripeCustomerId = stripeCustomer.id;
            console.log('Added stripeCustomer', stripeCustomer);
            // update customer in local db
      const savedCustomer = await setCustomer(customer);
        }

        const subscription = await subscriptionCreate(customer.StripeCustomerId, customerSubs);
        console.log('subscription', subscription);
    return successHandler({
                message: 'subscription Created!',
                subscription,
            });
    }
    catch(error) {
        console.log('oops something went wrong', error);
    return errorHandler('ERROR startPayment FAILED!', error);
    }
};
