import {Stripe} from 'stripe';
import { Stripe_API_Version } from '@src/config';

export const productCreate = async (product): Promise<Stripe.Product> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: Stripe_API_Version,
        typescript: true,
    });

    console.log('In here productCreate');
    const params: Stripe.ProductCreateParams = {
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
    }
};
