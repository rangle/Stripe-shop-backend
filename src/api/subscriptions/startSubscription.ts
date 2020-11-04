import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {
    getCustomerItems,
    getSubscriptionItems,
} from "../../services/db/getCustomerCartUtils";
import {customerRead} from "../../services/db/customerRead";
import {customerCreate} from "../../services/stripe/customerCreate";
import {customerWrite} from "../../services/db/customerWrite";
import {subscriptionCreate} from "../../services/stripe/subscriptionCreate";
import { CartItems, StripeSubscriptionItems } from 'src/types';

export const startSubscription: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    /**
     * @todo pass in an optional "Product ID" if users want to setup a Specific Product
     * This could be done here, as Subscriptions are typically managed 1 at a time.
     */
    const {
        customerId,
    }: any = JSON.parse((event as APIGatewayEvent).body);

    try {
        // Check if Customer exists
        const customer = await customerRead(customerId);
        if (! customer) {
            return errorHandler(
                callBack,
                'ERROR startSubscription FAILED!',
                'The customer was not found',
            );
        };

        // Check if Customer has any Subscriptions
        const items: CartItems = await getCustomerItems(customerId);
        if (! items.length) {
            return errorHandler(
                callBack,
                'ERROR startSubscription FAILED!',
                'Your Cart is empty',
            );
        };
        // filter items for Subscriptions.
        const products = await getSubscriptionItems(items);
        if (! products.length) {
            return errorHandler(
                callBack,
                'ERROR startSubscription FAILED!',
                'Your Cart has no Subscriptions',
            );
        };

        const keyedItems = items.reduce((acc: any, item) => {
            acc[item.productId] = item
            return acc;
        }, {});

        const customerSubs: StripeSubscriptionItems[] = products.map((item) => ({
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
            const savedCustomer = await customerWrite(customer);
        }

        const subscription = await subscriptionCreate(customer.StripeCustomerId, customerSubs);
        console.log('subscription', subscription);
        return successHandler(
            callBack,
            {
                message: 'subscription Created!',
                subscription,
            });
    }
    catch(error) {
        console.log('oops something went wrong', error);
        return errorHandler(
            callBack,
            'ERROR startPayment FAILED!',
            error
        );
    }
}
