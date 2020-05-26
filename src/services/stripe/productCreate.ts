import {Stripe} from 'stripe';

export const productCreate = async (product): Promise<Stripe.Product> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    console.log('In here productCreate');
    const params: StripeProductInput = {
        name: product.name,
        description: product.description,
    };

    // Create the Customer:
    try {
        console.log('params', params);
        const stripeProduct: Stripe.Product = await stripe.products.create(params);
        return stripeProduct;
    }
    catch (error) {
        console.log('Unable to save product to Stripe Platform', params);
        throw(error);
    };
};
