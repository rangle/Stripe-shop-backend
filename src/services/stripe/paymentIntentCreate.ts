import {Stripe} from 'stripe';

export const paymentIntentCreate = async (paymentIntent: PaymentIntent): Promise<Stripe.PaymentIntent> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    // Create the PaymentIntent:
    try {
        return await stripe.paymentIntents.create(paymentIntent);
    }
    catch (error) {
        console.log('Unable to save customer to Stripe Platform');
        throw(error);
    };
};
