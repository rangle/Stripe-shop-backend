import {Stripe} from 'stripe';

export const priceCreate = async ({productId, unit_amount, currency, interval}): Promise<Stripe.Price> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: Stripe_API_Version,
        typescript: true,
    });

    console.log('In here priceCreate');
    const params: StripePrice = {
        product: productId,
        unit_amount: unit_amount,
        currency: currency,
        recurring: {
            interval: interval,
        }
    };

    // Create the Customer:
    try {
        console.log('params', params);
        const stripeProduct: Stripe.Price = await stripe.prices.create(params);
        return stripeProduct;
    }
    catch (error) {
        console.log('Unable to save price to Stripe Platform', {params, error});
        throw(error);
    }
};
