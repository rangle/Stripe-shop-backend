import { Stripe_API_Version } from '../../config';
import { StripeSubscriptionItems, StripeSubscription } from '../../types';
import { Stripe } from 'stripe';

export const subscriptionCreate = async (customerId: string, items: StripeSubscriptionItems[]): Promise<Stripe.Subscription> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: Stripe_API_Version,
        typescript: true,
    });

    console.log('In here subscriptionCreate');
    const params: StripeSubscription = {
        customer: customerId,
        items: items,
    };

    // Create the Customer:
    try {
        console.log('params', params);
        const stripeSubscription: Stripe.Subscription = await stripe.subscriptions.create(params);
        return stripeSubscription;
    }
    catch (error) {
        console.log('Unable to save product to Stripe Platform', params);
        throw(error);
    }
}
