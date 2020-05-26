import { Stripe } from 'stripe';

export const subscriptionCreate = async (customerId: string, items: StripeSubscriptionItems[]): Promise<Stripe.Subscription> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
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
    };
}
